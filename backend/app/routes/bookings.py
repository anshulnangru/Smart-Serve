from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.connection import get_db
from app.models.booking import Booking
from app.models.service import Service
from app.schemas.booking import BookingCreate, BookingOut
from app.routes.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/bookings", response_model=BookingOut)
async def create_booking(
    data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify service exists
    svc_result = await db.execute(select(Service).where(Service.id == data.service_id))
    if not svc_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Service not found")

    booking = Booking(
        user_id=current_user.id,
        service_id=data.service_id,
        package_id=data.package_id,
        booking_date=data.booking_date,
        time_slot=data.time_slot,
        address=data.address,
        pincode=data.pincode,
        notes=data.notes,
        total_price=data.total_price,
        booking_status="confirmed",
        payment_status="pending",
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking


@router.get("/bookings")
async def list_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking)
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
    )
    bookings = result.scalars().all()

    enriched = []
    for b in bookings:
        svc = await db.get(Service, b.service_id)
        enriched.append({
            "id": b.id,
            "user_id": b.user_id,
            "service_id": b.service_id,
            "service_name": svc.name if svc else "Unknown",
            "service_image": svc.image if svc else None,
            "package_id": b.package_id,
            "booking_date": b.booking_date,
            "time_slot": b.time_slot,
            "address": b.address,
            "pincode": b.pincode,
            "notes": b.notes,
            "total_price": b.total_price,
            "booking_status": b.booking_status,
            "payment_status": b.payment_status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })
    return enriched


@router.patch("/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking).where(
            Booking.id == booking_id,
            Booking.user_id == current_user.id,
        )
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.booking_status == "cancelled":
        raise HTTPException(status_code=400, detail="Already cancelled")

    booking.booking_status = "cancelled"
    await db.commit()
    await db.refresh(booking)
    return {"message": "Booking cancelled", "id": booking.id, "booking_status": booking.booking_status}
