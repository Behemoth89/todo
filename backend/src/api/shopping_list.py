from fastapi import APIRouter
from typing import Optional
from prisma import Prisma

router = APIRouter()
db = Prisma()

@router.get("/shopping-list")
async def get_shopping_list(
    filter_bought: Optional[bool] = None,
    filter_todo: Optional[str] = None,
    filter_location: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
):
    await db.connect()
    try:
        where = {"deletedAt": None, "todo": {"deletedAt": None}}
        if filter_bought is not None:
            where["isBought"] = filter_bought
        if filter_todo:
            where["todoId"] = filter_todo
        if filter_location:
            where["todo"] = {"locationId": filter_location}
        
        items = await db.shoppingitem.find_many(
            where=where,
            include={"todo": {"include": {"location": True}}, "boughtBy": True},
            order_by=[{"isBought": "asc"}, {"todo": {"dueDate": "asc"}}],
            skip=(page - 1) * limit,
            take=limit,
        )
        
        return {
            "items": [{
                "id": i.id,
                "description": i.description,
                "amount": i.amount,
                "price": i.price,
                "notes": i.notes,
                "is_bought": i.isBought,
                "todo": {"id": i.todo.id, "title": i.todo.title, "location": {"id": i.todo.location.id, "name": i.todo.location.name} if i.todo.location else None},
                "bought_by": {"id": i.boughtBy.id, "name": i.boughtBy.name} if i.boughtBy else None,
                "bought_at": i.boughtAt.isoformat() if i.boughtAt else None,
            } for i in items],
            "total": len(items),
            "page": page,
        }
    finally:
        await db.disconnect()