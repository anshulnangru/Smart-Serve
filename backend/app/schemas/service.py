from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PackageOut(BaseModel):
    id: int
    service_id: int
    package_name: str
    package_price: float
    features: Optional[List[str]] = None
    duration_minutes: Optional[int] = None

    model_config = {"from_attributes": True}


class ServiceOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: str
    category_id: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    rating: float
    reviews_count: int
    image: Optional[str] = None
    badge: Optional[str] = None
    duration: Optional[str] = None
    includes: Optional[List[str]] = None
    professionals_count: int
    packages: List[PackageOut] = []

    model_config = {"from_attributes": True}
