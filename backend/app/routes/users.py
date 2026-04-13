from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.db import db
from app.models.user import UserCreate, UserLogin, GoogleLoginRequest, MicrosoftLoginRequest, UpdateUsernameRequest, UpdatePasswordRequest
from app.utils.serializers import serialize_mongo
from app.utils.security import hash_password, verify_password, create_access_token
from firebase_admin import credentials, auth as firebase_auth
import firebase_admin
import os
import json

if not firebase_admin._apps:
    firebase_env = os.environ.get("FIREBASE_CREDENTIALS")
    if firebase_env:
        firebase_credentials = json.loads(firebase_env)
        cred = credentials.Certificate(firebase_credentials)
    else:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        cred = credentials.Certificate(os.path.join(BASE_DIR, "serviceAccountKey.json"))
    firebase_admin.initialize_app(cred)

router = APIRouter(prefix="/users", tags=["Users"])

users = db.users


@router.post("/")
def create_user(user: UserCreate):
    try:
        if users.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="El email ya está registrado")

        hashed_password = hash_password(user.password)

        result = users.insert_one({
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
            "role": user.role,
            "createdAt": datetime.utcnow(),
        })

        return {
            "id": str(result.inserted_id),
            "message": "Usuario creado correctamente"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login_user(user: UserLogin):
    db_user = users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not db_user.get("password"):
        raise HTTPException(status_code=401, detail="Esta cuenta usa Google o Microsoft para iniciar sesión")

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


@router.post("/google-login")
def google_login(body: GoogleLoginRequest):
    try:
        decoded = firebase_auth.verify_id_token(body.id_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token de Google inválido")

    email = decoded.get("email")
    name = decoded.get("name", email.split("@")[0])

    db_user = users.find_one({"email": email})

    if not db_user:
        result = users.insert_one({
            "username": name,
            "email": email,
            "password": None,
            "role": "player",
            "createdAt": datetime.utcnow(),
        })
        db_user = users.find_one({"_id": result.inserted_id})

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


@router.post("/microsoft-login")
def microsoft_login(body: MicrosoftLoginRequest):
    try:
        decoded = firebase_auth.verify_id_token(body.id_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token de Microsoft inválido")

    email = decoded.get("email")
    name = decoded.get("name", email.split("@")[0])

    db_user = users.find_one({"email": email})

    if not db_user:
        result = users.insert_one({
            "username": name,
            "email": email,
            "password": None,
            "role": "player",
            "createdAt": datetime.utcnow(),
        })
        db_user = users.find_one({"_id": result.inserted_id})

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


@router.put("/{user_id}/username")
def update_username(user_id: str, body: UpdateUsernameRequest):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID de usuario inválido.")

    if users.find_one({"username": body.username, "_id": {"$ne": oid}}):
        raise HTTPException(status_code=409, detail="Ese nombre de usuario ya está en uso.")

    result = users.update_one(
        {"_id": oid},
        {"$set": {"username": body.username, "updatedAt": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    return {"message": "Nombre de usuario actualizado correctamente."}


@router.put("/{user_id}/password")
def update_password(user_id: str, body: UpdatePasswordRequest):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID de usuario inválido.")

    db_user = users.find_one({"_id": oid})
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if not db_user.get("password"):
        raise HTTPException(status_code=400, detail="Tu cuenta usa inicio de sesión social. No tienes contraseña local.")

    if not verify_password(body.current_password, db_user["password"]):
        raise HTTPException(status_code=401, detail="La contraseña actual es incorrecta.")

    if verify_password(body.new_password, db_user["password"]):
        raise HTTPException(status_code=400, detail="La nueva contraseña no puede ser igual a la actual.")

    users.update_one(
        {"_id": oid},
        {"$set": {"password": hash_password(body.new_password), "updatedAt": datetime.utcnow()}}
    )

    return {"message": "Contraseña actualizada correctamente."}


@router.delete("/{user_id}")
def delete_user(user_id: str):
    result = users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No encontramos tu usuario :(")
    return {"ok": True}