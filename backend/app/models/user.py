from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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