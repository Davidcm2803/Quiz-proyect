from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "player"  # "admin" | "host" | "player"

class User(UserCreate):
    createdAt: Optional[datetime] = None