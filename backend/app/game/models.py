import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Optional

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import Base
from app.core.uuidv7 import uuid7

if TYPE_CHECKING:
    from app.customer.models import CustomerProfile
    from app.order.models import Order


class GamePlatform(Base):
    __tablename__ = "game_platforms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(
        String(50), nullable=False, default="CONSOLE"
    )
    description: Mapped[str] = mapped_column(
        String(500), nullable=False, default=""
    )
    hourly_rate: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False, default=150.00
    )
    total_units: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    available_units: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    location: Mapped[str] = mapped_column(
        String(150), nullable=False, default="Campus Gaming Arena"
    )
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    features: Mapped[Any] = mapped_column(
        JSONB().with_variant(JSON, "sqlite"), nullable=False, default=list
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    tickets: Mapped[list["GameTicket"]] = relationship(
        "GameTicket", back_populates="platform"
    )

    __table_args__ = (
        CheckConstraint(
            "hourly_rate >= 0", name="ck_game_platforms_hourly_rate_non_negative"
        ),
        CheckConstraint(
            "total_units > 0 AND available_units >= 0",
            name="ck_game_platforms_units_valid",
        ),
    )


class GameTicket(Base):
    __tablename__ = "game_tickets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid7
    )
    ticket_code: Mapped[str] = mapped_column(
        String(32), unique=True, nullable=False, index=True
    )
    customer_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customer_profiles.id"), nullable=False
    )
    platform_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("game_platforms.id"), nullable=False
    )
    station_label: Mapped[str] = mapped_column(String(50), nullable=False)
    duration_hours: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    players_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    ticket_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="ACTIVE"
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    linked_order_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True
    )
    fulfillment_mode: Mapped[str | None] = mapped_column(
        String(20), nullable=True
    )
    order_pushed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
    order_pushed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    platform: Mapped["GamePlatform"] = relationship(
        "GamePlatform", back_populates="tickets"
    )
    customer_profile: Mapped["CustomerProfile"] = relationship("CustomerProfile")
    linked_order: Mapped[Optional["Order"]] = relationship("Order")

    __table_args__ = (
        CheckConstraint(
            "duration_hours > 0", name="ck_game_tickets_duration_positive"
        ),
        CheckConstraint(
            "ticket_amount >= 0", name="ck_game_tickets_amount_non_negative"
        ),
        Index(
            "idx_game_tickets_status_end_time",
            status,
            order_pushed,
            end_time,
        ),
        Index(
            "idx_game_tickets_customer",
            customer_profile_id,
            created_at.desc(),
        ),
    )

