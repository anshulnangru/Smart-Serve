from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.connection import get_db
from app.models.partner import PartnerApplication
from app.schemas.partner import PartnerCreate, PartnerOut

router = APIRouter()


@router.post("/partner/apply", response_model=PartnerOut)
async def apply_as_partner(data: PartnerCreate, db: AsyncSession = Depends(get_db)):
    # Check for duplicate email
    existing = await db.execute(
        select(PartnerApplication).where(PartnerApplication.email == data.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="An application with this email already exists. We'll be in touch!"
        )

    application = PartnerApplication(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        city=data.city,
        service_category=data.service_category,
        experience_years=data.experience_years,
        about=data.about,
        status="pending",
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/partner/applications", response_model=list[PartnerOut])
async def list_applications(db: AsyncSession = Depends(get_db)):
    """Admin endpoint — list all partner applications."""
    result = await db.execute(
        select(PartnerApplication).order_by(PartnerApplication.created_at.desc())
    )
    return result.scalars().all()
