from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.connection import Base


class PartnerApplication(Base):
    __tablename__ = "partner_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)
    service_category = Column(String, nullable=False)
    experience_years = Column(Integer, nullable=False)
    about = Column(String, nullable=True)
    status = Column(String, default="pending")   # pending / approved / rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
