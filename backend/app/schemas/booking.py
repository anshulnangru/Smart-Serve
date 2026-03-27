from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookingCreate(BaseModel):
    service_id: int
    package_id: Optional[int] = None
    booking_date: str
    time_slot: str
    address: str
    pincode: Optional[str] = None
    notes: Optional[str] = None
    total_price: float


class BookingOut(BaseModel):
    id: int
    user_id: int
    service_id: int
    package_id: Optional[int] = None
    booking_date: str
    time_slot: str
    address: str
    pincode: Optional[str] = None
    notes: Optional[str] = None
    total_price: float
    booking_status: str
    payment_status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
