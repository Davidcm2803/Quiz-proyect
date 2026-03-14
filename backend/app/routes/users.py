from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from passlib.context import CryptContext
from app.db import db
from app.models.user import UserCreate
from app.utils.serializers import serialize_mongo

router = APIRouter(prefix="/users", tags=["Users"])

users = db.users
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/")
def create_user(user: UserCreate):
    # verifica que el email no esté ya registrado
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    result = users.insert_one({
        "username": user.username,
        "email": user.email,
        "password": pwd_context.hash(user.password), # hashea la contra
        "role": user.role,
        "createdAt": datetime.utcnow(),
    })
    return {"id": str(result.inserted_id)}


@router.get("/")
def get_users():
    return [serialize_mongo(u) for u in users.find()]


@router.get("/{user_id}")
def get_user(user_id: str):
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return serialize_mongo(user)


@router.delete("/{user_id}")
def delete_user(user_id: str):
    result = users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"ok": True}