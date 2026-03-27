from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    category_id = Column(String, nullable=True, index=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    rating = Column(Float, default=4.5)
    reviews_count = Column(Integer, default=0)
    image = Column(String, nullable=True)
    badge = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    includes = Column(JSON, nullable=True)
    professionals_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    packages = relationship("ServicePackage", back_populates="service")
    bookings = relationship("Booking", back_populates="service")
    reviews = relationship("Review", back_populates="service")


class ServicePackage(Base):
    __tablename__ = "service_packages"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    package_name = Column(String, nullable=False)
    package_price = Column(Float, nullable=False)
    features = Column(JSON, nullable=True)
    duration_minutes = Column(Integer, nullable=True)

    service = relationship("Service", back_populates="packages")
    bookings = relationship("Booking", back_populates="package")
