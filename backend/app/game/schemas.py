import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.order.schemas import OrderItemCreate, OrderResponse


class GamePlatformCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    category: str = Field("CONSOLE", max_length=50)
    description: str = Field("", max_length=500)
    hourly_rate: float = Field(..., ge=0)
    total_units: int = Field(5, gt=0)
    available_units: int = Field(5, ge=0)
    location: str = Field("Campus Gaming Arena", max_length=150)
    image_url: str | None = None
    features: list[str] = Field(default_factory=list)
    is_active: bool = True


class GamePlatformUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120)
    category: str | None = Field(None, max_length=50)
    description: str | None = Field(None, max_length=500)
    hourly_rate: float | None = Field(None, ge=0)
    total_units: int | None = Field(None, gt=0)
    available_units: int | None = Field(None, ge=0)
    location: str | None = Field(None, max_length=150)
    image_url: str | None = None
    features: list[str] | None = None
    is_active: bool | None = None


class GamePlatformResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    category: str
    description: str
    hourly_rate: float
    total_units: int
    available_units: int
    location: str
    image_url: str | None = None
    features: Any = Field(default_factory=list)
    is_active: bool
    created_at: datetime
    updated_at: datetime


class GamePairedFoodOrderCreate(BaseModel):
    branch_id: uuid.UUID
    branch_name: str | None = None
    fulfillment_mode: Literal["DINE_IN", "TAKEAWAY"] = "DINE_IN"
    items: list[OrderItemCreate] = Field(..., min_length=1)
    instructions: str | None = None
    use_store_credit: bool = False


class GameTicketCreateRequest(BaseModel):
    platform_id: uuid.UUID
    duration_hours: int = Field(2, gt=0, le=12)
    players_count: int = Field(1, gt=0, le=10)
    start_time: datetime | None = None
    station_label: str | None = None
    food_order: GamePairedFoodOrderCreate | None = None


class GameTicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    ticket_code: str
    customer_profile_id: uuid.UUID
    platform_id: uuid.UUID
    station_label: str
    duration_hours: int
    players_count: int
    ticket_amount: float
    status: str
    start_time: datetime
    end_time: datetime
    linked_order_id: uuid.UUID | None = None
    fulfillment_mode: str | None = None
    order_pushed: bool
    order_pushed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    platform: GamePlatformResponse | None = None
    linked_order: OrderResponse | None = None


class GameTicketExtendRequest(BaseModel):
    additional_hours: int = Field(1, gt=0, le=6)

