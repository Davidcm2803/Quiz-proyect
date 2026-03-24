from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "player"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    username: str
    email: EmailStr
    role: str = "player"
    createdAt: Optional[datetime] = None


class GoogleLoginRequest(BaseModel):
    id_token: str


class MicrosoftLoginRequest(BaseModel):
    id_token: str


class UpdateUsernameRequest(BaseModel):
    username: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("El nombre debe tener al menos 3 caracteres.")
        if len(v) > 30:
            raise ValueError("El nombre no puede superar los 30 caracteres.")
        if not re.match(r"^[a-zA-Z0-9._]+$", v):
            raise ValueError("Solo se permiten letras, números, puntos y guiones bajos.")
        return v


class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        errors = []
        if len(v) < 8:
            errors.append("al menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
            errors.append("una mayúscula")
        if not re.search(r"[a-z]", v):
            errors.append("una minúscula")
        if not re.search(r"\d", v):
            errors.append("un número")
        if not re.search(r"[^a-zA-Z0-9]", v):
            errors.append("un carácter especial")
        if errors:
            raise ValueError(f"La contraseña debe tener: {', '.join(errors)}.")
        return v