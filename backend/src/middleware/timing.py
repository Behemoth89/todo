from fastapi import Request
from ..utils.logger import get_logger, bind_request_id
import time
import uuid

async def timing_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    bind_request_id(request_id)
    start_time = time.time()
    
    logger = get_logger("timing")
    logger.info("request_started", method=request.method, path=request.url.path)
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    logger.info("request_completed", method=request.method, path=request.url.path, duration_ms=round(duration * 1000, 2))
    
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration * 1000:.2f}ms"
    return response