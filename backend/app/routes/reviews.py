from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.connection import get_db
from app.models.review import Review
from app.models.user import User

router = APIRouter()


@router.get("/reviews/{service_id}")
async def get_reviews(service_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).where(Review.service_id == service_id)
    )
    reviews = result.scalars().all()

    enriched = []
    for r in reviews:
        user = await db.get(User, r.user_id)
        enriched.append({
            "id": r.id,
            "user_id": r.user_id,
            "service_id": r.service_id,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "user_name": user.name if user else "Anonymous",
            "user_avatar": user.avatar if user else None,
        })
    return enriched
