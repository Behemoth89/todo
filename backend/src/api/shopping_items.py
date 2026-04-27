from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ..middleware.auth import get_current_user
from ..utils.errors import NotFoundError, ConflictError
from prisma import Prisma

router = APIRouter()
db = Prisma()

class ShoppingItemCreate(BaseModel):
    description: str
    amount: Optional[str] = None
    price: Optional[float] = None
    notes: Optional[str] = None
    version: Optional[int] = None

class ShoppingItemUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[str] = None
    price: Optional[float] = None
    notes: Optional[str] = None
    is_bought: Optional[bool] = None
    version: int

@router.get("/todos/{todo_id}/shopping-items")
async def list_shopping_items(todo_id: str):
    await db.connect()
    try:
        items = await db.shoppingitem.find_many(
            where={"todoId": todo_id, "deletedAt": None},
            include={"boughtBy": True}
        )
        return [{"id": i.id, "description": i.description, "amount": i.amount, "price": i.price,
                 "notes": i.notes, "is_bought": i.isBought, "bought_by": {"id": i.boughtBy.id, "name": i.boughtBy.name} if i.boughtBy else None,
                 "bought_at": i.boughtAt.isoformat() if i.boughtAt else None} for i in items]
    finally:
        await db.disconnect()

@router.post("/todos/{todo_id}/shopping-items")
async def create_shopping_item(todo_id: str, data: ShoppingItemCreate):
    await db.connect()
    try:
        item = await db.shoppingitem.create({
            "todoId": todo_id,
            "description": data.description,
            "amount": data.amount,
            "price": data.price,
            "notes": data.notes,
        })
        return {"id": item.id, "description": item.description, "amount": item.amount, "price": item.price,
                "notes": item.notes, "is_bought": item.isBought}
    finally:
        await db.disconnect()

@router.put("/shopping-items/{item_id}")
async def update_shopping_item(item_id: str, data: ShoppingItemUpdate, current_user: dict = Depends(get_current_user)):
    await db.connect()
    try:
        item = await db.shoppingitem.find_unique(where={"id": item_id})
        if not item or item.deletedAt:
            raise NotFoundError("Shopping item not found")
        
        if item.version != data.version:
            raise ConflictError("The shopping item was modified by another user", item.version)
        
        update_data = {"version": {"increment": 1}}
        if data.description is not None:
            update_data["description"] = data.description
        if data.amount is not None:
            update_data["amount"] = data.amount
        if data.price is not None:
            update_data["price"] = data.price
        if data.notes is not None:
            update_data["notes"] = data.notes
        if data.is_bought is not None:
            update_data["isBought"] = data.is_bought
            if data.is_bought:
                update_data["boughtById"] = current_user["id"]
                update_data["boughtAt"] = "now"
        
        item = await db.shoppingitem.update(where={"id": item_id}, data=update_data)
        return {"id": item.id, "description": item.description, "amount": item.amount, "price": item.price,
                "notes": item.notes, "is_bought": item.isBought}
    finally:
        await db.disconnect()

@router.delete("/shopping-items/{item_id}")
async def delete_shopping_item(item_id: str):
    await db.connect()
    try:
        await db.shoppingitem.update(where={"id": item_id}, data={"deletedAt": "now"})
        return {"success": True}
    finally:
        await db.disconnect()