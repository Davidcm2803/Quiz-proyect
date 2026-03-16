from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.db import db
from app.models.user import UserCreate, UserLogin
from app.utils.serializers import serialize_mongo
from app.utils.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])

users = db.users

@router.post("/")
def create_user(user: UserCreate):
    try:
        if users.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="El email ya está registrado")

        print("PASSWORD RECIBIDA:", repr(user.password))
        print("LARGO:", len(user.password))
        print("BYTES:", len(user.password.encode("utf-8")))

        hashed_password = hash_password(user.password)
        print("HASH OK")

        result = users.insert_one({
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
            "role": user.role,
            "createdAt": datetime.utcnow(),
        })

        print("INSERT OK", result.inserted_id)
        return {
            "id": str(result.inserted_id),
            "message": "Usuario creado correctamente"
        }

    except HTTPException:
        raise
    except Exception as e:
        print("ERROR EN CREATE_USER:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login_user(user: UserLogin):
    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token = create_access_token(
        data={
            "sub": str(db_user["_id"]),
            "email": db_user["email"],
            "role": db_user.get("role", "player")
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "username": db_user["username"],
            "email": db_user["email"],
            "role": db_user.get("role", "player")
        }
    }
@router.get("/")
def get_users():
    return [serialize_mongo(u) for u in users.find()]


@router.get("/{user_id}")
def get_user(user_id: str):
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="No encontramos tu usuario :(")
    return serialize_mongo(user)


@router.delete("/{user_id}")
def delete_user(user_id: str):
    result = users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No encontramos tu usuario :(")
    return {"ok": True}
