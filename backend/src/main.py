from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os

from .middleware.timing import timing_middleware
from .utils.errors import error_handler, AppError
from .utils.config import get_settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    photo_dir = settings.photo_upload_dir
    if not os.path.exists(photo_dir):
        os.makedirs(photo_dir, exist_ok=True)
    yield

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Family Chores Todo API",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.middleware("http")(timing_middleware)
    
    app.add_exception_handler(AppError, error_handler)

    app.mount("/uploads", StaticFiles(directory=settings.photo_upload_dir), name="uploads")

    @app.get("/health")
    async def health():
        return {"status": "healthy"}

    from .api import todos, users, auth, settings, shopping_items, shopping_list, photos
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(todos.router, prefix="/api/todos", tags=["todos"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
    app.include_router(shopping_items.router, prefix="/api", tags=["shopping-items"])
    app.include_router(shopping_list.router, prefix="/api", tags=["shopping-list"])
    app.include_router(photos.router, prefix="/api", tags=["photos"])

    return app

app = create_app()