from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import traceback
from .logger import get_logger

logger = get_logger("errors")

class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class ConflictError(AppError):
    def __init__(self, message: str, current_version: int):
        super().__init__(message, status_code=409)
        self.current_version = current_version

class NotFoundError(AppError):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)

class ValidationAppError(AppError):
    def __init__(self, message: str, errors: list[dict] | None = None):
        super().__init__(message, status_code=422)
        self.errors = errors or []

async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    if isinstance(exc, ConflictError):
        return JSONResponse(
            status_code=409,
            content={
                "error": "conflict",
                "message": exc.message,
                "current_version": exc.current_version,
            },
        )
    if isinstance(exc, NotFoundError):
        return JSONResponse(
            status_code=404,
            content={"error": "not_found", "message": exc.message},
        )
    if isinstance(exc, ValidationAppError):
        return JSONResponse(
            status_code=422,
            content={"error": "validation", "message": exc.message, "errors": exc.errors},
        )
    if isinstance(exc, (ValidationError, AppError)):
        return JSONResponse(
            status_code=exc.status_code if isinstance(exc, AppError) else 422,
            content={"error": "error", "message": str(exc)},
        )
    
    logger.error("unhandled_exception", error=str(exc), traceback=traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"error": "internal", "message": "An unexpected error occurred"},
    )