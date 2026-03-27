from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt as _bcrypt
import os

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, UserUpdate, AuthResponse

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "smartserve-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    user_id = decode_token(token)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ── Register ──────────────────────────────────────────────────────────────────
@router.post("/auth/register", response_model=AuthResponse)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        avatar=f"https://i.pravatar.cc/150?u={data.email}",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return AuthResponse(
        user=UserOut.model_validate(user),
        token=create_token(user.id),
        message="Registration successful!",
    )


# ── Login ─────────────────────────────────────────────────────────────────────
@router.post("/auth/login", response_model=AuthResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return AuthResponse(
        user=UserOut.model_validate(user),
        token=create_token(user.id),
        message="Login successful!",
    )


# ── Get current user ──────────────────────────────────────────────────────────
@router.get("/auth/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ── Update profile ────────────────────────────────────────────────────────────
@router.patch("/auth/profile")
async def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.name:
        current_user.name = data.name.strip()
    if data.phone is not None:
        current_user.phone = data.phone.strip()
    if data.address is not None:
        current_user.address = data.address.strip()

    await db.commit()
    await db.refresh(current_user)
    return {"user": UserOut.model_validate(current_user), "message": "Profile updated!"}
