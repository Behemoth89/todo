import { get_settings } from './config'

class Validators:
    @staticmethod
    def validate_photo_size(file_size: int) -> bool:
        settings = get_settings()
        max_bytes = settings.max_photo_size_mb * 1024 * 1024
        return file_size <= max_bytes

    @staticmethod
    def validate_photo_extension(filename: str) -> bool:
        allowed = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
        return any(filename.lower().endswith(ext) for ext in allowed)

    @staticmethod
    def validate_todo_title(title: str) -> tuple[bool, str | None]:
        if not title or not title.strip():
            return False, "Title is required"
        if len(title) > 200:
            return False, "Title must be 200 characters or less"
        return True, None

    @staticmethod
    def validate_todo_description(description: str | None) -> tuple[bool, str | None]:
        if description and len(description) > 5000:
            return False, "Description must be 5000 characters or less"
        return True, None

    @staticmethod
    def validate_shopping_item_description(description: str) -> tuple[bool, str | None]:
        if not description or not description.strip():
            return False, "Description is required"
        if len(description) > 500:
            return False, "Description must be 500 characters or less"
        return True, None

    @staticmethod
    def validate_shopping_item_price(price: float | None) -> tuple[bool, str | None]:
        if price is not None and price < 0:
            return False, "Price cannot be negative"
        return True, None

    @staticmethod
    def validate_username(username: str) -> tuple[bool, str | None]:
        if not username or len(username) < 3:
            return False, "Username must be at least 3 characters"
        if len(username) > 50:
            return False, "Username must be 50 characters or less"
        return True, None

    @staticmethod
    def validate_user_name(name: str) -> tuple[bool, str | None]:
        if not name or len(name) > 100:
            return False, "Name must be 100 characters or less"
        return True, None