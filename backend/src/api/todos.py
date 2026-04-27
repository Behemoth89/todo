from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..middleware.auth import get_current_user
from ..utils.errors import NotFoundError, ConflictError
from prisma import Prisma

router = APIRouter()
db = Prisma()

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority_id: Optional[str] = None
    location_id: Optional[str] = None
    parent_todo_id: Optional[str] = None
    assignee_ids: list[str] = []
    start_date: Optional[str] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None
    version: Optional[int] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority_id: Optional[str] = None
    location_id: Optional[str] = None
    parent_todo_id: Optional[str] = None
    assignee_ids: Optional[list[str]] = None
    start_date: Optional[str] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None
    completion_date: Optional[str] = None
    version: int

class TodoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    priority: Optional[dict]
    location: Optional[dict]
    assignees: list[dict]
    parent_todo: Optional[dict]
    start_date: Optional[str]
    due_date: Optional[str]
    completion_date: Optional[str]
    notes: Optional[str]
    is_ready_to_execute: bool
    created_at: str
    updated_at: str
    version: int

async def calculate_ready_status(todo_id: str) -> bool:
    parent = await db.todo.find_unique(where={"id": todo_id})
    if parent and parent.parentTodoId:
        parent_todo = await db.todo.find_unique(where={"id": parent.parentTodoId})
        if parent_todo and not parent_todo.completionDate:
            return False
    
    unbought = await db.shoppingitem.find_many(
        where={"todoId": todo_id, "isBought": False, "deletedAt": None}
    )
    if unbought:
        return False
    return True

@router.get("")
async def list_todos(
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    filter_status: Optional[str] = "active",
    filter_priority: Optional[str] = None,
    filter_assignee: Optional[str] = None,
    filter_location: Optional[str] = None,
    filter_ready: Optional[bool] = None,
    page: int = 1,
    limit: int = 20,
):
    await db.connect()
    try:
        where = {}
        if filter_status == "active":
            where["deletedAt"] = None
        elif filter_status == "completed":
            where["completionDate"] = {"not": None}
        
        if filter_priority:
            where["priorityId"] = filter_priority
        if filter_location:
            where["locationId"] = filter_location
        
        todos = await db.todo.find_many(
            where=where,
            include={"priority": True, "location": True, "assignees": {"include": {"user": True}}},
            order={sort_by: sort_order} if sort_by else None,
            skip=(page - 1) * limit,
            take=limit,
        )
        
        results = []
        for todo in todos:
            is_ready = await calculate_ready_status(todo.id)
            if filter_ready is not None and is_ready != filter_ready:
                continue
            results.append({
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "priority": {"id": todo.priority.id, "name": todo.priority.name} if todo.priority else None,
                "location": {"id": todo.location.id, "name": todo.location.name} if todo.location else None,
                "assignees": [{"id": a.user.id, "name": a.user.name} for a in todo.assignees],
                "parent_todo": None,
                "start_date": todo.startDate.isoformat() if todo.startDate else None,
                "due_date": todo.dueDate.isoformat() if todo.dueDate else None,
                "completion_date": todo.completionDate.isoformat() if todo.completionDate else None,
                "notes": todo.notes,
                "is_ready_to_execute": is_ready,
                "created_at": todo.createdAt.isoformat(),
                "updated_at": todo.updatedAt.isoformat(),
                "version": todo.version,
            })
        
        return {"todos": results, "total": len(results), "page": page, "limit": limit}
    finally:
        await db.disconnect()

@router.post("")
async def create_todo(data: TodoCreate):
    await db.connect()
    try:
        todo = await db.todo.create({
            "title": data.title,
            "description": data.description,
            "priorityId": data.priority_id,
            "locationId": data.location_id,
            "parentTodoId": data.parent_todo_id,
            "startDate": data.start_date,
            "dueDate": data.due_date,
            "notes": data.notes,
        })
        
        for uid in data.assignee_ids:
            await db.todoassignee.create({"todoId": todo.id, "userId": uid})
        
        return {"todo": todo, "conflict": False}
    finally:
        await db.disconnect()

@router.get("/{todo_id}")
async def get_todo(todo_id: str):
    await db.connect()
    try:
        todo = await db.todo.find_unique(
            where={"id": todo_id},
            include={"priority": True, "location": True, "assignees": {"include": {"user": True}}}
        )
        if not todo or todo.deletedAt:
            raise NotFoundError("Todo not found")
        return {"todo": todo}
    finally:
        await db.disconnect()

@router.put("/{todo_id}")
async def update_todo(todo_id: str, data: TodoUpdate):
    await db.connect()
    try:
        todo = await db.todo.find_unique(where={"id": todo_id})
        if not todo or todo.deletedAt:
            raise NotFoundError("Todo not found")
        
        if todo.version != data.version:
            raise ConflictError("The todo was modified by another user", todo.version)
        
        updated = await db.todo.update(
            where={"id": todo_id},
            data={
                "title": data.title,
                "description": data.description,
                "priorityId": data.priority_id,
                "locationId": data.location_id,
                "parentTodoId": data.parent_todo_id,
                "startDate": data.start_date,
                "dueDate": data.due_date,
                "notes": data.notes,
                "completionDate": data.completion_date,
                "version": {"increment": 1},
            }
        )
        return {"todo": updated, "conflict": False}
    finally:
        await db.disconnect()

@router.delete("/{todo_id}")
async def delete_todo(todo_id: str):
    await db.connect()
    try:
        await db.todo.update(where={"id": todo_id}, data={"deletedAt": "now"})
        return {"success": True}
    finally:
        await db.disconnect()