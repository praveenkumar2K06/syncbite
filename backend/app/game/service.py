import secrets
import uuid
from collections.abc import Sequence
from datetime import datetime, timedelta, timezone
from typing import Any

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.models import User
from app.core.exceptions import DomainInvariantError, EntityNotFoundError
from app.credit.service import StoreCreditService
from app.game.models import GamePlatform, GameTicket
from app.game.schemas import (
    GamePlatformCreate,
    GamePlatformUpdate,
    GameTicketCreateRequest,
)
from app.menu.models import MenuCategory, MenuItem
from app.order.models import Order, OrderItem, OrderStatusLog
from app.order.websocket_manager import ws_manager

logger = structlog.get_logger()

DEFAULT_GAME_PLATFORMS: list[dict[str, Any]] = [
    {
        "name": "PlayStation 5 Pro Arena",
        "category": "CONSOLE",
        "description": "4K 120Hz OLED lounges with DualSense Edge controllers, FIFA 26, Tekken 8, Spider-Man 2 & GTA Online.",
        "hourly_rate": 150.0,
        "total_units": 8,
        "available_units": 6,
        "location": "Level 1 · Neon Console Lounge",
        "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
        "features": ["4K 120Hz OLED", "DualSense Edge", "Up to 4 Players", "Co-op Library"],
    },
    {
        "name": "RTX 4090 Esports PC Rig",
        "category": "PC",
        "description": "360Hz BenQ Zowie monitors, mechanical optical keyboards, and fiber LAN for Valorant, CS2 & Dota 2.",
        "hourly_rate": 120.0,
        "total_units": 15,
        "available_units": 11,
        "location": "Level 1 · Cyber LAN Boot-Camp",
        "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        "features": ["RTX 4090 GPU", "360Hz Monitor", "1Gbps Fiber", "HyperX Cloud III"],
    },
    {
        "name": "Meta Quest 3 VR Omni-Pod",
        "category": "VR",
        "description": "Full-room wireless VR arena with haptic vests for Beat Saber, Half-Life: Alyx & Superhot VR.",
        "hourly_rate": 220.0,
        "total_units": 4,
        "available_units": 3,
        "location": "Level 2 · Holo-Deck Bay",
        "image_url": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80",
        "features": ["Wireless 4K+ VR", "Haptic Suit", "Full Room-Scale", "Mixed Reality"],
    },
    {
        "name": "Championship Snooker & Pool",
        "category": "TABLE",
        "description": "Tournament-grade 8-ball pool and English snooker tables with pro Aramith balls and carbon cues.",
        "hourly_rate": 180.0,
        "total_units": 6,
        "available_units": 5,
        "location": "Ground Floor · Cue Club",
        "image_url": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
        "features": ["Pro Felt Table", "Carbon Cues", "2–4 Players", "Table-side Service"],
    },
    {
        "name": "Cosmic 10-Pin Bowling Alley",
        "category": "ARCADE",
        "description": "UV glow-in-the-dark bowling lanes with automated scoring, arcade bumpers, and lounge seating.",
        "hourly_rate": 300.0,
        "total_units": 4,
        "available_units": 4,
        "location": "Basement · Strike Zone",
        "image_url": "https://images.unsplash.com/photo-1545232972-90f3f027e22f?auto=format&fit=crop&w=800&q=80",
        "features": ["UV Cosmic Lanes", "Up to 6 Players", "Shoe Rental Included", "Auto Scorer"],
    },
]


class GameService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def ensure_default_platforms(self) -> None:
        stmt = select(GamePlatform).limit(1)
        res = await self.session.execute(stmt)
        if res.scalars().first() is not None:
            return

        for p_data in DEFAULT_GAME_PLATFORMS:
            platform = GamePlatform(
                name=p_data["name"],
                category=p_data["category"],
                description=p_data["description"],
                hourly_rate=p_data["hourly_rate"],
                total_units=p_data["total_units"],
                available_units=p_data["available_units"],
                location=p_data["location"],
                image_url=p_data["image_url"],
                features=p_data["features"],
                is_active=True,
            )
            self.session.add(platform)
        await self.session.commit()

    async def list_platforms(
        self, include_inactive: bool = False
    ) -> Sequence[GamePlatform]:
        await self.ensure_default_platforms()
        stmt = select(GamePlatform).order_by(GamePlatform.created_at.asc())
        if not include_inactive:
            stmt = stmt.where(GamePlatform.is_active.is_(True))
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_platform(self, platform_id: uuid.UUID) -> GamePlatform:
        stmt = select(GamePlatform).where(GamePlatform.id == platform_id)
        res = await self.session.execute(stmt)
        platform = res.scalars().first()
        if not platform:
            raise EntityNotFoundError(
                message=f"Game platform '{platform_id}' not found.",
                error_code="GAME_PLATFORM_NOT_FOUND",
            )
        return platform

    async def create_platform(self, req: GamePlatformCreate) -> GamePlatform:
        platform = GamePlatform(
            name=req.name,
            category=req.category.upper(),
            description=req.description,
            hourly_rate=round(req.hourly_rate, 2),
            total_units=req.total_units,
            available_units=min(req.available_units, req.total_units),
            location=req.location,
            image_url=req.image_url,
            features=req.features,
            is_active=req.is_active,
        )
        self.session.add(platform)
        await self.session.commit()
        await self.session.refresh(platform)
        return platform

    async def update_platform(
        self, platform_id: uuid.UUID, req: GamePlatformUpdate
    ) -> GamePlatform:
        platform = await self.get_platform(platform_id)
        update_data = req.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "category" and isinstance(value, str):
                value = value.upper()
            setattr(platform, field, value)
        if platform.available_units > platform.total_units:
            platform.available_units = platform.total_units
        await self.session.commit()
        await self.session.refresh(platform)
        return platform

    async def delete_platform(self, platform_id: uuid.UUID) -> None:
        platform = await self.get_platform(platform_id)
        platform.is_active = False
        await self.session.commit()

    def _generate_station_label(self, category: str, unit_num: int) -> str:
        prefix_map = {
            "CONSOLE": "PS5",
            "PC": "PC",
            "VR": "VR",
            "TABLE": "POOL",
            "ARCADE": "LANE",
        }
        prefix = prefix_map.get(category.upper(), "STN")
        return f"{prefix}-{unit_num:02d}"

    async def book_ticket(
        self,
        user_id: uuid.UUID,
        customer_profile_id: uuid.UUID,
        req: GameTicketCreateRequest,
    ) -> GameTicket:
        platform = await self.get_platform(req.platform_id)
        if not platform.is_active:
            raise DomainInvariantError(
                message=f"Game platform '{platform.name}' is currently inactive.",
                error_code="GAME_PLATFORM_INACTIVE",
            )
        if platform.available_units <= 0:
            raise DomainInvariantError(
                message=f"No available units right now for '{platform.name}'.",
                error_code="GAME_PLATFORM_FULL",
            )

        now = datetime.now(timezone.utc)
        start_time = req.start_time if req.start_time else now
        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)
        end_time = start_time + timedelta(hours=req.duration_hours)

        unit_index = max(1, platform.total_units - platform.available_units + 1)
        station_label = req.station_label or self._generate_station_label(
            platform.category, unit_index
        )
        ticket_code = f"GM-{secrets.token_hex(3).upper()}"
        ticket_amount = round(
            float(platform.hourly_rate) * req.duration_hours * req.players_count, 2
        )

        # Decrement available units
        platform.available_units = max(0, platform.available_units - 1)

        linked_order: Order | None = None
        fulfillment_mode: str | None = None

        if req.food_order and len(req.food_order.items) > 0:
            fulfillment_mode = req.food_order.fulfillment_mode
            food_total = 0.0
            order_items: list[OrderItem] = []

            for item_req in req.food_order.items:
                stmt = (
                    select(MenuItem)
                    .where(
                        MenuItem.id == item_req.menu_item_id,
                        MenuItem.deleted_at.is_(None),
                    )
                    .options(
                        selectinload(MenuItem.category).selectinload(MenuCategory.menu)
                    )
                )
                res = await self.session.execute(stmt)
                menu_item = res.scalars().first()
                if not menu_item:
                    raise EntityNotFoundError(
                        message=f"Menu item '{item_req.menu_item_id}' not found.",
                        error_code="MENU_ITEM_NOT_FOUND",
                    )
                if (
                    menu_item.category is not None
                    and menu_item.category.menu is not None
                    and menu_item.category.menu.branch_id != req.food_order.branch_id
                ):
                    raise DomainInvariantError(
                        message=f"Menu item '{menu_item.id}' does not belong to branch '{req.food_order.branch_id}'.",
                        error_code="CROSS_BRANCH_ORDER_VIOLATION",
                    )

                unit_price = float(menu_item.base_price)
                food_total += unit_price * item_req.quantity
                order_items.append(
                    OrderItem(
                        menu_item_id=menu_item.id,
                        item_name_snapshot=menu_item.name,
                        unit_price_snapshot=unit_price,
                        quantity=item_req.quantity,
                        selected_modifiers_snapshot=item_req.selected_modifiers_snapshot
                        or (
                            [{"note": f"[{fulfillment_mode.replace('_', '-')}] Game Ticket {ticket_code} ({station_label})"}]
                        ),
                    )
                )

            end_local_str = end_time.astimezone().strftime("%I:%M %p")
            delivery_snapshot = {
                "branch_name": req.food_order.branch_name or "Campus Stall",
                "fulfillment_mode": fulfillment_mode,
                "order_type": fulfillment_mode,
                "pickup_time": f"End of Game ({end_local_str})",
                "date": "Today",
                "instructions": req.food_order.instructions
                or f"{fulfillment_mode.replace('_', ' ')} · Auto-push after {req.duration_hours}h game on {platform.name} ({station_label})",
                "is_game_order": True,
                "game_ticket_code": ticket_code,
                "game_platform_name": platform.name,
                "game_duration_hours": req.duration_hours,
                "station_label": station_label,
                "scheduled_push_at": end_time.isoformat(),
                "auto_pushed": False,
            }

            linked_order = Order(
                customer_profile_id=customer_profile_id,
                branch_id=req.food_order.branch_id,
                total_amount=round(food_total, 2),
                status="SCHEDULED",
                delivery_address_snapshot=delivery_snapshot,
            )
            self.session.add(linked_order)
            await self.session.flush()

            for oi in order_items:
                oi.order_id = linked_order.id
                self.session.add(oi)

            initial_log = OrderStatusLog(
                order_id=linked_order.id,
                previous_status=None,
                new_status="SCHEDULED",
                changed_by_user_id=user_id,
            )
            self.session.add(initial_log)
            await self.session.flush()

            if req.food_order.use_store_credit and linked_order.total_amount > 0:
                credit_service = StoreCreditService(self.session)
                brand_id = await credit_service.brand_id_for_branch(
                    req.food_order.branch_id
                )
                applied = await credit_service.redeem(
                    customer_profile_id=customer_profile_id,
                    brand_id=brand_id,
                    max_amount=float(linked_order.total_amount),
                    order_id=linked_order.id,
                )
                linked_order.store_credit_applied = applied

        ticket = GameTicket(
            ticket_code=ticket_code,
            customer_profile_id=customer_profile_id,
            platform_id=platform.id,
            station_label=station_label,
            duration_hours=req.duration_hours,
            players_count=req.players_count,
            ticket_amount=ticket_amount,
            status="ACTIVE",
            start_time=start_time,
            end_time=end_time,
            linked_order_id=linked_order.id if linked_order else None,
            fulfillment_mode=fulfillment_mode,
            order_pushed=False,
        )
        self.session.add(ticket)
        await self.session.commit()

        refreshed = await self.get_ticket(ticket.id)

        if linked_order:
            await ws_manager.broadcast_to_branch(
                branch_id=linked_order.branch_id,
                message={
                    "event": "GAME_ORDER_SCHEDULED",
                    "order_id": str(linked_order.id),
                    "ticket_code": ticket.ticket_code,
                    "fulfillment_mode": fulfillment_mode,
                    "scheduled_push_at": end_time.isoformat(),
                    "status": "SCHEDULED",
                },
            )

        return refreshed

    async def get_ticket(self, ticket_id: uuid.UUID) -> GameTicket:
        stmt = (
            select(GameTicket)
            .where(GameTicket.id == ticket_id)
            .options(
                selectinload(GameTicket.platform),
                selectinload(GameTicket.linked_order).selectinload(Order.items),
                selectinload(GameTicket.linked_order).selectinload(Order.status_logs),
            )
        )
        res = await self.session.execute(stmt)
        ticket = res.scalars().first()
        if not ticket:
            raise EntityNotFoundError(
                message=f"Game ticket '{ticket_id}' not found.",
                error_code="GAME_TICKET_NOT_FOUND",
            )
        return ticket

    async def list_customer_tickets(
        self, customer_profile_id: uuid.UUID
    ) -> Sequence[GameTicket]:
        stmt = (
            select(GameTicket)
            .where(GameTicket.customer_profile_id == customer_profile_id)
            .options(
                selectinload(GameTicket.platform),
                selectinload(GameTicket.linked_order).selectinload(Order.items),
                selectinload(GameTicket.linked_order).selectinload(Order.status_logs),
            )
            .order_by(GameTicket.created_at.desc())
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def list_all_tickets(
        self, status: str | None = None
    ) -> Sequence[GameTicket]:
        stmt = (
            select(GameTicket)
            .options(
                selectinload(GameTicket.platform),
                selectinload(GameTicket.linked_order).selectinload(Order.items),
                selectinload(GameTicket.linked_order).selectinload(Order.status_logs),
            )
            .order_by(GameTicket.created_at.desc())
        )
        if status:
            stmt = stmt.where(GameTicket.status == status.upper())
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def push_ticket_order(
        self,
        ticket_id: uuid.UUID,
        actor_user_id: uuid.UUID | None = None,
    ) -> GameTicket:
        """
        Completes the game session (or triggers at the end of the 2-hour game duration)
        and automatically pushes the linked SCHEDULED food order to the restaurant as PLACED!
        """
        ticket = await self.get_ticket(ticket_id)
        if ticket.status == "CANCELLED":
            raise DomainInvariantError(
                message="Cannot push order for a cancelled game ticket.",
                error_code="GAME_TICKET_CANCELLED",
            )

        now = datetime.now(timezone.utc)

        # Free up the gaming station if ticket was ACTIVE
        if ticket.status == "ACTIVE" and ticket.platform:
            ticket.platform.available_units = min(
                ticket.platform.total_units, ticket.platform.available_units + 1
            )
        ticket.status = "COMPLETED"

        pushed_order: Order | None = None
        if ticket.linked_order_id and not ticket.order_pushed:
            order_stmt = (
                select(Order)
                .where(Order.id == ticket.linked_order_id)
                .options(
                    selectinload(Order.items),
                    selectinload(Order.status_logs),
                )
            )
            order_res = await self.session.execute(order_stmt)
            order = order_res.scalars().first()

            if order and order.status == "SCHEDULED":
                # Resolve actor user_id for status log if called by background scheduler
                resolved_user_id = actor_user_id
                if resolved_user_id is None:
                    if order.status_logs:
                        resolved_user_id = order.status_logs[0].changed_by_user_id
                    else:
                        user_res = await self.session.execute(select(User.id).limit(1))
                        resolved_user_id = user_res.scalars().first()

                prev_status = order.status
                order.status = "PLACED"

                snapshot = dict(order.delivery_address_snapshot or {})
                snapshot["auto_pushed"] = True
                snapshot["pushed_at"] = now.isoformat()
                snapshot["pickup_time"] = (
                    f"Game Ended · {ticket.fulfillment_mode or 'DINE_IN'} Ready"
                )
                order.delivery_address_snapshot = snapshot

                if resolved_user_id:
                    log = OrderStatusLog(
                        order_id=order.id,
                        previous_status=prev_status,
                        new_status="PLACED",
                        changed_by_user_id=resolved_user_id,
                    )
                    self.session.add(log)

                ticket.order_pushed = True
                ticket.order_pushed_at = now
                pushed_order = order

        await self.session.commit()
        refreshed = await self.get_ticket(ticket.id)

        if pushed_order:
            logger.info(
                "GameOrderAutoPushedEvent",
                ticket_id=str(ticket.id),
                ticket_code=ticket.ticket_code,
                order_id=str(pushed_order.id),
                branch_id=str(pushed_order.branch_id),
                fulfillment_mode=ticket.fulfillment_mode,
            )
            await ws_manager.broadcast_to_branch(
                branch_id=pushed_order.branch_id,
                message={
                    "event": "ORDER_PLACED",
                    "order_id": str(pushed_order.id),
                    "total_amount": float(pushed_order.total_amount),
                    "status": pushed_order.status,
                    "auto_pushed_from_game": True,
                    "ticket_code": ticket.ticket_code,
                    "fulfillment_mode": ticket.fulfillment_mode,
                    "station_label": ticket.station_label,
                },
            )

        return refreshed

    async def cancel_ticket(
        self,
        ticket_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> GameTicket:
        ticket = await self.get_ticket(ticket_id)
        if ticket.status == "CANCELLED":
            return ticket

        if ticket.status == "ACTIVE" and ticket.platform:
            ticket.platform.available_units = min(
                ticket.platform.total_units, ticket.platform.available_units + 1
            )
        ticket.status = "CANCELLED"

        if (
            ticket.linked_order
            and ticket.linked_order.status in {"SCHEDULED", "PLACED"}
        ):
            prev = ticket.linked_order.status
            ticket.linked_order.status = "CANCELLED"
            self.session.add(
                OrderStatusLog(
                    order_id=ticket.linked_order.id,
                    previous_status=prev,
                    new_status="CANCELLED",
                    changed_by_user_id=user_id,
                )
            )

        await self.session.commit()
        return await self.get_ticket(ticket.id)

    async def extend_ticket(
        self,
        ticket_id: uuid.UUID,
        additional_hours: int,
        user_id: uuid.UUID,
    ) -> GameTicket:
        """
        Increases the duration of play for an active game session.
        Automatically updates ticket end_time and delays the auto-pushed food order delivery accordingly!
        """
        ticket = await self.get_ticket(ticket_id)
        if ticket.status != "ACTIVE":
            raise DomainInvariantError(
                message=f"Only ACTIVE game tickets can be extended. Current status is {ticket.status}.",
                error_code="GAME_TICKET_NOT_ACTIVE",
            )

        ticket.duration_hours += additional_hours
        ticket.end_time = ticket.end_time + timedelta(hours=additional_hours)
        if ticket.platform:
            ticket.ticket_amount = round(
                float(ticket.ticket_amount) + float(ticket.platform.hourly_rate) * additional_hours * ticket.players_count, 2
            )

        # Broadcast update to restaurant so kitchen knows food delivery time is delayed
        if ticket.linked_order_id and not ticket.order_pushed and ticket.linked_order:
            await ws_manager.broadcast_to_branch(
                branch_id=ticket.linked_order.branch_id,
                message={
                    "event": "GAME_ORDER_RESCHEDULED",
                    "order_id": str(ticket.linked_order.id),
                    "ticket_code": ticket.ticket_code,
                    "new_scheduled_push_at": ticket.end_time.isoformat(),
                    "additional_hours": additional_hours,
                    "total_duration_hours": ticket.duration_hours,
                    "status": "SCHEDULED",
                },
            )

        await self.session.commit()
        return await self.get_ticket(ticket.id)

