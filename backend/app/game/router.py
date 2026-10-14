import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.router import get_current_user
from app.auth.schemas import UserClaims
from app.core.database import get_db_session
from app.core.exceptions import EntityNotFoundError, ForbiddenError
from app.customer.repository import CustomerRepository
from app.game.schemas import (
    GamePlatformCreate,
    GamePlatformResponse,
    GamePlatformUpdate,
    GameTicketCreateRequest,
    GameTicketExtendRequest,
    GameTicketResponse,
)
from app.game.service import GameService

router = APIRouter(prefix="/games", tags=["Game Platforms & Tickets"])

STAFF_ROLES = {
    "KitchenStaff",
    "BranchManager",
    "MerchantOwner",
    "PlatformAdmin",
    "Admin",
}


def get_game_service(
    session: AsyncSession = Depends(get_db_session),
) -> GameService:
    return GameService(session=session)


@router.get(
    "/platforms",
    response_model=list[GamePlatformResponse],
    status_code=status.HTTP_200_OK,
    summary="List game platforms",
    description="Returns available game platforms (PS5, PC, VR, Pool, Bowling, etc.) with hourly rates and live availability.",
)
async def list_game_platforms(
    include_inactive: bool = Query(False),
    service: GameService = Depends(get_game_service),
) -> list[GamePlatformResponse]:
    platforms = await service.list_platforms(include_inactive=include_inactive)
    return [GamePlatformResponse.model_validate(p) for p in platforms]


@router.post(
    "/platforms",
    response_model=GamePlatformResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create game platform (Admin)",
)
async def create_game_platform(
    req: GamePlatformCreate,
    current_user: UserClaims = Depends(get_current_user),
    service: GameService = Depends(get_game_service),
) -> GamePlatformResponse:
    if current_user.role not in STAFF_ROLES:
        raise ForbiddenError(
            message="Only administrators or staff can create game platforms.",
            error_code="GAME_PLATFORM_FORBIDDEN",
        )
    platform = await service.create_platform(req)
    return GamePlatformResponse.model_validate(platform)


@router.patch(
    "/platforms/{id}",
    response_model=GamePlatformResponse,
    status_code=status.HTTP_200_OK,
    summary="Update game platform (Admin)",
)
async def update_game_platform(
    id: uuid.UUID,
    req: GamePlatformUpdate,
    current_user: UserClaims = Depends(get_current_user),
    service: GameService = Depends(get_game_service),
) -> GamePlatformResponse:
    if current_user.role not in STAFF_ROLES:
        raise ForbiddenError(
            message="Only administrators or staff can update game platforms.",
            error_code="GAME_PLATFORM_FORBIDDEN",
        )
    platform = await service.update_platform(id, req)
    return GamePlatformResponse.model_validate(platform)


@router.delete(
    "/platforms/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deactivate game platform (Admin)",
)
async def delete_game_platform(
    id: uuid.UUID,
    current_user: UserClaims = Depends(get_current_user),
    service: GameService = Depends(get_game_service),
) -> None:
    if current_user.role not in STAFF_ROLES:
        raise ForbiddenError(
            message="Only administrators or staff can delete game platforms.",
            error_code="GAME_PLATFORM_FORBIDDEN",
        )
    await service.delete_platform(id)


@router.post(
    "/tickets",
    response_model=GameTicketResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Book game platform ticket with optional paired food order",
    description="Books a game platform session (e.g., 2 hours) and optionally attaches a food order (DINE_IN or TAKEAWAY) that automatically pushes to the restaurant when the game session ends.",
)
async def book_game_ticket(
    req: GameTicketCreateRequest,
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> GameTicketResponse:
    cust_repo = CustomerRepository(session)
    profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
    if not profile:
        raise EntityNotFoundError("Customer profile not found.", "CUSTOMER_NOT_FOUND")

    ticket = await service.book_ticket(
        user_id=uuid.UUID(current_user.sub),
        customer_profile_id=profile.id,
        req=req,
    )
    return GameTicketResponse.model_validate(ticket)


@router.get(
    "/tickets",
    response_model=list[GameTicketResponse],
    status_code=status.HTTP_200_OK,
    summary="List game tickets",
    description="Lists booked game platform tickets for the current student or all tickets for staff/admin.",
)
async def list_game_tickets(
    ticket_status: str | None = Query(None, alias="status"),
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> list[GameTicketResponse]:
    if current_user.role in STAFF_ROLES:
        tickets = await service.list_all_tickets(status=ticket_status)
    else:
        cust_repo = CustomerRepository(session)
        profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
        if not profile:
            return []
        tickets = await service.list_customer_tickets(profile.id)

    return [GameTicketResponse.model_validate(t) for t in tickets]


@router.get(
    "/tickets/{id}",
    response_model=GameTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Get game ticket details",
)
async def get_game_ticket(
    id: uuid.UUID,
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> GameTicketResponse:
    ticket = await service.get_ticket(id)
    if current_user.role == "Customer":
        cust_repo = CustomerRepository(session)
        profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
        if not profile or profile.id != ticket.customer_profile_id:
            raise ForbiddenError(
                message="You do not have access to this game ticket.",
                error_code="GAME_TICKET_FORBIDDEN",
            )
    return GameTicketResponse.model_validate(ticket)


@router.post(
    "/tickets/{id}/push-order",
    response_model=GameTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger end-of-game auto-push to restaurant",
    description="Ends the game session and pushes the linked SCHEDULED food order (DINE_IN or TAKEAWAY) to the restaurant as PLACED.",
)
async def push_game_ticket_order(
    id: uuid.UUID,
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> GameTicketResponse:
    ticket = await service.get_ticket(id)
    if current_user.role == "Customer":
        cust_repo = CustomerRepository(session)
        profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
        if not profile or profile.id != ticket.customer_profile_id:
            raise ForbiddenError(
                message="You do not have access to this game ticket.",
                error_code="GAME_TICKET_FORBIDDEN",
            )
    pushed = await service.push_ticket_order(
        ticket_id=id,
        actor_user_id=uuid.UUID(current_user.sub),
    )
    return GameTicketResponse.model_validate(pushed)


@router.post(
    "/tickets/{id}/cancel",
    response_model=GameTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Cancel game ticket and linked scheduled order",
)
async def cancel_game_ticket(
    id: uuid.UUID,
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> GameTicketResponse:
    ticket = await service.get_ticket(id)
    if current_user.role == "Customer":
        cust_repo = CustomerRepository(session)
        profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
        if not profile or profile.id != ticket.customer_profile_id:
            raise ForbiddenError(
                message="You do not have access to this game ticket.",
                error_code="GAME_TICKET_FORBIDDEN",
            )
    cancelled = await service.cancel_ticket(
        ticket_id=id,
        user_id=uuid.UUID(current_user.sub),
    )
    return GameTicketResponse.model_validate(cancelled)


@router.post(
    "/tickets/{id}/extend",
    response_model=GameTicketResponse,
    status_code=status.HTTP_200_OK,
    summary="Extend game session duration and reschedule food delivery",
    description="Increases play duration by specified additional hours and delays the auto-pushed food order delivery accordingly.",
)
async def extend_game_ticket(
    id: uuid.UUID,
    req: GameTicketExtendRequest,
    current_user: UserClaims = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
    service: GameService = Depends(get_game_service),
) -> GameTicketResponse:
    ticket = await service.get_ticket(id)
    if current_user.role == "Customer":
        cust_repo = CustomerRepository(session)
        profile = await cust_repo.get_by_user_id(uuid.UUID(current_user.sub))
        if not profile or profile.id != ticket.customer_profile_id:
            raise ForbiddenError(
                message="You do not have access to this game ticket.",
                error_code="GAME_TICKET_FORBIDDEN",
            )
    extended = await service.extend_ticket(
        ticket_id=id,
        additional_hours=req.additional_hours,
        user_id=uuid.UUID(current_user.sub),
    )
    return GameTicketResponse.model_validate(extended)

