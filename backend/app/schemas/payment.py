from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    booking_id: int
    amount: float
    payment_method: Optional[str] = "UPI"
    transaction_id: Optional[str] = None


class PaymentOut(BaseModel):
    id: int
    booking_id: int
    amount: float
    payment_method: Optional[str] = None
    payment_status: str
    transaction_id: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
