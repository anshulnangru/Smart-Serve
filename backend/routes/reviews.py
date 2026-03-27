from fastapi import APIRouter
from data import REVIEWS

router = APIRouter()


@router.get("/reviews/{service_id}")
def get_reviews(service_id: int):
    reviews = [r for r in REVIEWS if r["service_id"] == service_id]
    return {"reviews": reviews, "total": len(reviews)}
