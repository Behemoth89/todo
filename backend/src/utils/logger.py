import structlog
from contextvars import ContextVar

request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)

def get_logger(name: str | None = None) -> structlog.BoundLogger:
    logger = structlog.get_logger()
    if name:
        logger = logger.bind(component=name)
    request_id = request_id_var.get()
    if request_id:
        logger = logger.bind(request_id=request_id)
    return logger

def bind_request_id(request_id: str) -> None:
    request_id_var.set(request_id)