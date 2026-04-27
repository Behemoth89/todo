from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ..middleware.auth import get_current_user
from prisma import Prisma

router = APIRouter()
db = Prisma()

class UserCreate(BaseModel):
    username: str
    password: str
    name: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str

@router.get("")
async def list_users():
    await db.connect()
    try:
        users = await db.user.find_many(where={"deletedAt": None})
        return [{"id": u.id, "username": u.username, "name": u.name} for u in users]
    finally:
        await db.disconnect()

@router.post("")
async def create_user(data: UserCreate):
    await db.connect()
    try:
        from ..utils.auth import hash_password
        user = await db.user.create({
            "username": data.username,
            "passwordHash": hash_password(data.password),
            "name": data.name,
        })
        return {"id": user.id, "username": user.username, "name": user.name}
    finally:
        await db.disconnect()

@router.put("/{user_id}")
async def update_user(user_id: str, data: UserCreate):
    await db.connect()
    try:
        from ..utils.auth import hash_password
        user = await db.user.update(
            where={"id": user_id},
            data={"username": data.username, "passwordHash": hash_password(data.password), "name": data.name}
        )
        return {"id": user.id, "username": user.username, "name": user.name}
    finally:
        await db.disconnect()

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    await db.connect()
    try:
        await db.user.update(where={"id": user_id}, data={"deletedAt": "now"})
        return {"success": True}
    finally:
        await db.disconnect()