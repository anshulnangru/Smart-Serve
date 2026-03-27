from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    service_id: int
    rating: float
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    user_id: int
    service_id: int
    rating: float
    comment: Optional[str] = None
    created_at: Optional[datetime] = None
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    model_config = {"from_attributes": True}
