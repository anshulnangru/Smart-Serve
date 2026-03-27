from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional

from app.database.connection import get_db
from app.models.service import Service, ServicePackage

router = APIRouter()

TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
]

CITIES = [
    "New Delhi", "Mumbai", "Bangalore", "Hyderabad",
    "Chennai", "Pune", "Kolkata", "Ahmedabad",
]


@router.get("/services")
async def list_services(
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Service)
    if category:
        q = q.where(Service.category_id == category)
    result = await db.execute(q)
    services = result.scalars().all()
    return services


@router.get("/services/{service_id}")
async def get_service(service_id: int, db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Service.category_id, Service.category).distinct()
    )
    rows = result.all()
    cats = [{"id": r[0], "name": r[1]} for r in rows if r[0]]
    return cats


@router.get("/time-slots")
async def get_time_slots():
    return TIME_SLOTS


@router.get("/cities")
async def get_cities():
    return CITIES
