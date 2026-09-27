"""game_platforms and game_tickets tables

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-13

"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None

_TS = dict(server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False)


def upgrade() -> None:
    op.create_table(
        "game_platforms",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column(
            "category", sa.String(50), nullable=False, server_default="CONSOLE"
        ),
        sa.Column("description", sa.String(500), nullable=False, server_default=""),
        sa.Column(
            "hourly_rate", sa.Numeric(10, 2), nullable=False, server_default="150"
        ),
        sa.Column("total_units", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("available_units", sa.Integer(), nullable=False, server_default="5"),
        sa.Column(
            "location",
            sa.String(150),
            nullable=False,
            server_default="Campus Gaming Arena",
        ),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.Column(
            "features",
            postgresql.JSONB().with_variant(sa.JSON(), "sqlite"),
            nullable=False,
            server_default="[]",
        ),
        sa.Column(
            "is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), **_TS),
        sa.Column("updated_at", sa.DateTime(timezone=True), **_TS),
        sa.CheckConstraint(
            "hourly_rate >= 0", name="ck_game_platforms_hourly_rate_non_negative"
        ),
        sa.CheckConstraint(
            "total_units > 0 AND available_units >= 0",
            name="ck_game_platforms_units_valid",
        ),
    )

    op.create_table(
        "game_tickets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("ticket_code", sa.String(32), nullable=False, unique=True),
        sa.Column(
            "customer_profile_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customer_profiles.id"),
            nullable=False,
        ),
        sa.Column(
            "platform_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("game_platforms.id"),
            nullable=False,
        ),
        sa.Column("station_label", sa.String(50), nullable=False),
        sa.Column("duration_hours", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("players_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("ticket_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.String(30), nullable=False, server_default="ACTIVE"),
        sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "linked_order_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("orders.id"),
            nullable=True,
        ),
        sa.Column("fulfillment_mode", sa.String(20), nullable=True),
        sa.Column(
            "order_pushed",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("order_pushed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), **_TS),
        sa.Column("updated_at", sa.DateTime(timezone=True), **_TS),
        sa.CheckConstraint(
            "duration_hours > 0", name="ck_game_tickets_duration_positive"
        ),
        sa.CheckConstraint(
            "ticket_amount >= 0", name="ck_game_tickets_amount_non_negative"
        ),
    )
    op.create_index(
        "ix_game_tickets_ticket_code", "game_tickets", ["ticket_code"], unique=True
    )
    op.create_index(
        "idx_game_tickets_status_end_time",
        "game_tickets",
        ["status", "order_pushed", "end_time"],
    )
    op.create_index(
        "idx_game_tickets_customer",
        "game_tickets",
        ["customer_profile_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("idx_game_tickets_customer", table_name="game_tickets")
    op.drop_index("idx_game_tickets_status_end_time", table_name="game_tickets")
    op.drop_index("ix_game_tickets_ticket_code", table_name="game_tickets")
    op.drop_table("game_tickets")
    op.drop_table("game_platforms")

