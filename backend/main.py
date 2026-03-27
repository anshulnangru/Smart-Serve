from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

# Import all models so SQLAlchemy can create tables
import app.models  # noqa

from app.database.connection import engine, Base
from app.routes import auth, services, bookings, reviews, payments, partner


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Create all DB tables on startup (idempotent — safe to run every time)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="SmartServe API",
    description="Urban Company Clone — Home Services Booking Platform (PostgreSQL)",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api", tags=["Auth"])
app.include_router(services.router, prefix="/api", tags=["Services"])
app.include_router(bookings.router, prefix="/api", tags=["Bookings"])
app.include_router(reviews.router,  prefix="/api", tags=["Reviews"])
app.include_router(payments.router, prefix="/api", tags=["Payments"])
app.include_router(partner.router,  prefix="/api", tags=["Partner"])


@app.get("/")
def root():
    return {
        "message": "SmartServe API v2.0 with PostgreSQL is running!",
        "docs": "/docs",
        "version": "2.0.0",
    }
