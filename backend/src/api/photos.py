from fastapi import APIRouter, UploadFile, File, Depends
from ..middleware.auth import get_current_user
from ..utils.config import get_settings
from ..utils.errors import ValidationAppError
from prisma import Prisma
import os
import io
import uuid
from PIL import Image

router = APIRouter()
db = Prisma()

@router.post("/todos/{todo_id}/photos")
async def upload_photo(
    todo_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    settings = get_settings()
    await db.connect()
    try:
        todo = await db.todo.find_unique(where={"id": todo_id})
        if not todo or todo.deletedAt:
            raise ValidationAppError("Todo not found")
        
        if file.size and file.size > settings.max_photo_size_mb * 1024 * 1024:
            raise ValidationAppError(f"File size exceeds {settings.max_photo_size_mb}MB limit")
        
        contents = await file.read()
        
        try:
            img = Image.open(io.BytesIO(contents))
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")
            webp_filename = f"{uuid.uuid4()}.webp"
            webp_path = os.path.join(settings.photo_upload_dir, webp_filename)
            img.save(webp_path, "WEBP", quality=85)
        except Exception:
            raise ValidationAppError("Invalid image file")
        
        photo = await db.photo.create({
            "todoId": todo_id,
            "originalFilename": file.filename,
            "storedFilename": webp_filename,
            "filePath": webp_path,
            "fileSizeBytes": len(contents),
        })
        
        return {
            "photo": {
                "id": photo.id,
                "original_filename": photo.originalFilename,
                "stored_filename": photo.storedFilename,
                "file_size_bytes": photo.fileSizeBytes,
                "created_at": photo.createdAt.isoformat(),
            }
        }
    finally:
        await db.disconnect()

@router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str):
    await db.connect()
    try:
        photo = await db.photo.find_unique(where={"id": photo_id})
        if photo and os.path.exists(photo.filePath):
            os.remove(photo.filePath)
        await db.photo.update(where={"id": photo_id}, data={"deletedAt": "now"})
        return {"success": True}
    finally:
        await db.disconnect()