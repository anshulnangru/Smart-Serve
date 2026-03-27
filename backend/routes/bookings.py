from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from models import BookingCreate, Booking
from data import SERVICES, bookings_db, booking_id_counter, users_db
from datetime import datetime

router = APIRouter()


def get_user_id_from_token(authorization: Optional[str]) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    # Simple token: "token_<user_id>"
    try:
        user_id = int(token.split("_")[1])
        if user_id not in users_db:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except (IndexError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/bookings")
def create_booking(booking: BookingCreate, authorization: Optional[str] = Header(None)):
    user_id = get_user_id_from_token(authorization)
    service = next((s for s in SERVICES if s["id"] == booking.service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    booking_id = booking_id_counter[0]
    booking_id_counter[0] += 1

    new_booking = {
        "id": booking_id,
        "service_id": booking.service_id,
        "service_name": service["name"],
        "service_image": service["image"],
        "user_id": user_id,
        "date": booking.date,
        "time_slot": booking.time_slot,
        "address": booking.address,
        "city": booking.city,
        "pincode": booking.pincode,
        "notes": booking.notes,
        "status": "confirmed",
        "price": service["price"],
        "created_at": datetime.now().isoformat(),
    }
    bookings_db[booking_id] = new_booking
    return new_booking


@router.get("/bookings")
def get_bookings(authorization: Optional[str] = Header(None)):
    user_id = get_user_id_from_token(authorization)
    user_bookings = [b for b in bookings_db.values() if b["user_id"] == user_id]
    user_bookings.sort(key=lambda x: x["created_at"], reverse=True)
    return {"bookings": user_bookings}


@router.patch("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, authorization: Optional[str] = Header(None)):
    user_id = get_user_id_from_token(authorization)
    booking = bookings_db.get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    booking["status"] = "cancelled"
    return booking
