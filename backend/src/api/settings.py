from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ..middleware.auth import get_current_user
from ..utils.errors import NotFoundError
from prisma import Prisma

router = APIRouter()
db = Prisma()

class SettingsCreate(BaseModel):
    category: str
    name: str
    sort_order: Optional[int] = None

class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None

@router.get("")
async def get_settings():
    await db.connect()
    try:
        settings = await db.settings.find_many(where={"deletedAt": None})
        locations = [s for s in settings if s.category == "location"]
        priorities = [s for s in settings if s.category == "priority"]
        return {
            "locations": [{"id": s.id, "name": s.name, "sort_order": s.sortOrder} for s in locations],
            "priorities": [{"id": s.id, "name": s.name, "sort_order": s.sortOrder} for s in priorities],
        }
    finally:
        await db.disconnect()

@router.post("")
async def create_setting(data: SettingsCreate):
    await db.connect()
    try:
        setting = await db.settings.create({
            "category": data.category,
            "name": data.name,
            "sortOrder": data.sort_order,
        })
        return {"id": setting.id, "category": setting.category, "name": setting.name, "sort_order": setting.sortOrder}
    finally:
        await db.disconnect()

@router.put("/{setting_id}")
async def update_setting(setting_id: str, data: SettingsUpdate):
    await db.connect()
    try:
        setting = await db.settings.find_unique(where={"id": setting_id})
        if not setting or setting.deletedAt:
            raise NotFoundError("Setting not found")
        updated = await db.settings.update(
            where={"id": setting_id},
            data={"name": data.name, "sortOrder": data.sort_order}
        )
        return {"id": updated.id, "category": updated.category, "name": updated.name, "sort_order": updated.sortOrder}
    finally:
        await db.disconnect()

@router.delete("/{setting_id}")
async def delete_setting(setting_id: str):
    await db.connect()
    try:
        await db.settings.update(where={"id": setting_id}, data={"deletedAt": "now"})
        return {"success": True}
    finally:
        await db.disconnect()