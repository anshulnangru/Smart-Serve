from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("service_packages.id"), nullable=True)
    booking_date = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    address = Column(String, nullable=False)
    pincode = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    total_price = Column(Float, nullable=False)
    booking_status = Column(String, default="confirmed")   # pending/confirmed/completed/cancelled
    payment_status = Column(String, default="pending")    # pending/paid/refunded
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    package = relationship("ServicePackage", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)
