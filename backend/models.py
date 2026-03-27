from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Category(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    service_count: int


class Service(BaseModel):
    id: int
    name: str
    category_id: str
    category: str
    description: str
    rating: float
    reviews_count: int
    price: float
    original_price: Optional[float] = None
    duration: str
    image: str
    badge: Optional[str] = None
    includes: List[str] = []
    professionals_count: int = 0


class Review(BaseModel):
    id: int
    service_id: int
    user_name: str
    user_avatar: str
    rating: int
    comment: str
    date: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class User(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    avatar: Optional[str] = None


class AuthResponse(BaseModel):
    user: User
    token: str
    message: str


class BookingCreate(BaseModel):
    service_id: int
    date: str
    time_slot: str
    address: str
    city: str
    pincode: str
    notes: Optional[str] = None


class Booking(BaseModel):
    id: int
    service_id: int
    service_name: str
    service_image: str
    user_id: int
    date: str
    time_slot: str
    address: str
    city: str
    pincode: str
    notes: Optional[str] = None
    status: str  # pending, confirmed, completed, cancelled
    price: float
    created_at: str
