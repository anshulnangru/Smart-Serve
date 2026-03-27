from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, unique=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=True)   # UPI, card, cash, net_banking
    payment_status = Column(String, default="pending")  # pending/completed/failed/refunded
    transaction_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("Booking", back_populates="payment")
