from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PartnerCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    city: str
    service_category: str
    experience_years: int
    about: Optional[str] = None


class PartnerOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    city: str
    service_category: str
    experience_years: int
    about: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
