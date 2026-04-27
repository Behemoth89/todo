from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from ..utils.auth import verify_password, hash_password, create_access_token
from ..middleware.auth import get_current_user
from prisma import Prisma

router = APIRouter()
db = Prisma()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    await db.connect()
    try:
        user = await db.user.find_unique(where={"username": data.username})
        if not user or not verify_password(data.password, user.passwordHash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        token = create_access_token({"sub": user.id, "username": user.username})
        return LoginResponse(
            token=token,
            user={"id": user.id, "username": user.username, "name": user.name}
        )
    finally:
        await db.disconnect()

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"success": True}