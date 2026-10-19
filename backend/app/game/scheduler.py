import asyncio
from datetime import UTC, datetime

import structlog
from sqlalchemy import select

from app.core.base_model import Base
from app.core.database import AsyncSessionLocal, engine
from app.game.models import GamePlatform, GameTicket
from app.game.service import GameService

logger = structlog.get_logger()


async def init_game_tables_and_seed() -> None:
    """Ensure game_platforms and game_tickets tables exist and seed defaults."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(
                lambda sync_conn: Base.metadata.create_all(
                    sync_conn,
                    tables=[GamePlatform.__table__, GameTicket.__table__],
                    checkfirst=True,
                )
            )
        async with AsyncSessionLocal() as session:
            service = GameService(session)
            await service.ensure_default_platforms()
    except Exception as e:  # noqa: BLE001
        logger.warning("Could not auto-init game tables on startup", error=str(e))


async def process_expired_game_tickets_once() -> int:
    """
    Finds all ACTIVE game tickets whose end_time has passed and automatically
    pushes their linked SCHEDULED food order (DINE_IN or TAKEAWAY) to the restaurant.
    """
    pushed_count = 0
    now = datetime.now(UTC)
    async with AsyncSessionLocal() as session:
        stmt = select(GameTicket.id).where(
            GameTicket.status == "ACTIVE",
            GameTicket.end_time <= now,
        )
        res = await session.execute(stmt)
        expired_ids = list(res.scalars().all())

        if not expired_ids:
            return 0

        service = GameService(session)
        for ticket_id in expired_ids:
            try:
                await service.push_ticket_order(ticket_id=ticket_id)
                pushed_count += 1
            except Exception as e:  # noqa: BLE001
                logger.error(
                    "Failed to auto-push order for expired game ticket",
                    ticket_id=str(ticket_id),
                    error=str(e),
                )
    return pushed_count


async def run_game_order_auto_push_scheduler(interval_seconds: int = 5) -> None:
    """Background task that checks every few seconds for completed game sessions."""
    await init_game_tables_and_seed()
    logger.info(
        "GameOrderAutoPushSchedulerStarted",
        interval_seconds=interval_seconds,
    )
    while True:
        try:
            await process_expired_game_tickets_once()
        except asyncio.CancelledError:
            break
        except Exception as e:  # noqa: BLE001
            logger.warning("Game auto-push scheduler iteration error", error=str(e))
        await asyncio.sleep(interval_seconds)

