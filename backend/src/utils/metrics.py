from datetime import datetime
from typing import Any
from .logger import get_logger

class Metrics:
    def __init__(self):
        self.requests = 0
        self.errors = 0
        self.operations: dict[str, list[float]] = {}

    def increment_request(self) -> None:
        self.requests += 1

    def increment_error(self) -> None:
        self.errors += 1

    def record_operation(self, operation: str, duration_ms: float) -> None:
        if operation not in self.operations:
            self.operations[operation] = []
        self.operations[operation].append(duration_ms)

    def get_stats(self) -> dict[str, Any]:
        return {
            "total_requests": self.requests,
            "total_errors": self.errors,
            "operations": {
                op: {
                    "count": len(times),
                    "avg_ms": round(sum(times) / len(times), 2) if times else 0,
                    "max_ms": round(max(times), 2) if times else 0,
                }
                for op, times in self.operations.items()
            },
        }

metrics = Metrics()