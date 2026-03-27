from fastapi import APIRouter, HTTPException
from typing import Optional
from data import SERVICES, CATEGORIES

router = APIRouter()


@router.get("/categories")
def get_categories():
    return {"categories": CATEGORIES}


@router.get("/services")
def get_services(category: Optional[str] = None, search: Optional[str] = None):
    services = SERVICES
    if category:
        services = [s for s in services if s["category_id"] == category]
    if search:
        search_lower = search.lower()
        services = [
            s for s in services
            if search_lower in s["name"].lower()
            or search_lower in s["description"].lower()
            or search_lower in s["category"].lower()
        ]
    return {"services": services, "total": len(services)}


@router.get("/services/{service_id}")
def get_service(service_id: int):
    service = next((s for s in SERVICES if s["id"] == service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.get("/time-slots")
def get_time_slots():
    from data import TIME_SLOTS
    return {"time_slots": TIME_SLOTS}


@router.get("/cities")
def get_cities():
    from data import CITIES
    return {"cities": CITIES}
