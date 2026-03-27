from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from app.database.connection import get_db
from app.models.payment import Payment
from app.models.booking import Booking
from app.schemas.payment import PaymentCreate, PaymentOut
from app.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/payments", response_model=PaymentOut)
async def create_payment(
    data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify booking belongs to user
    result = await db.execute(
        select(Booking).where(
            Booking.id == data.booking_id,
            Booking.user_id == current_user.id,
        )
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    payment = Payment(
        booking_id=data.booking_id,
        amount=data.amount,
        payment_method=data.payment_method or "UPI",
        payment_status="completed",
        transaction_id=data.transaction_id or str(uuid.uuid4())[:8].upper(),
    )
    db.add(payment)

    # Update booking payment status
    booking.payment_status = "paid"
    await db.commit()
    await db.refresh(payment)
    return payment


@router.get("/payments/{booking_id}", response_model=PaymentOut)
async def get_payment(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Payment).where(Payment.booking_id == booking_id)
    )
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="No payment found for this booking")
    return payment
