from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from models import UserCreate, UserLogin, AuthResponse, User, UserUpdate
from data import users_db, user_id_counter
import hashlib

router = APIRouter()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_token(user_id: int) -> str:
    return f"token_{user_id}"


@router.post("/auth/register")
def register(user: UserCreate):
    existing = next((u for u in users_db.values() if u["email"] == user.email), None)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = user_id_counter[0]
    user_id_counter[0] += 1

    new_user = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password_hash": hash_password(user.password),
        "avatar": f"https://i.pravatar.cc/150?u={user.email}",
    }
    users_db[user_id] = new_user

    return {
        "user": {k: v for k, v in new_user.items() if k != "password_hash"},
        "token": make_token(user_id),
        "message": "Registration successful!",
    }


@router.post("/auth/login")
def login(credentials: UserLogin):
    user = next((u for u in users_db.values() if u["email"] == credentials.email), None)
    if not user or user["password_hash"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "user": {k: v for k, v in user.items() if k != "password_hash"},
        "token": make_token(user["id"]),
        "message": "Login successful!",
    }


@router.get("/auth/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    try:
        user_id = int(token.split("_")[1])
        user = users_db.get(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {k: v for k, v in user.items() if k != "password_hash"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.patch("/auth/profile")
def update_profile(
    update: UserUpdate,
    authorization: Optional[str] = Header(None),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    try:
        user_id = int(token.split("_")[1])
        user = users_db.get(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        if update.name is not None and update.name.strip():
            user["name"] = update.name.strip()
        if update.phone is not None:
            user["phone"] = update.phone.strip() if update.phone else None

        users_db[user_id] = user
        return {
            "user": {k: v for k, v in user.items() if k != "password_hash"},
            "message": "Profile updated successfully!",
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
