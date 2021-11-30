import string
from typing import Any, Dict, List, Optional
import uuid

import django
from django.utils.crypto import get_random_string


def generate_random_uuid() -> uuid.UUID:
    return uuid.uuid4()


def generate_alphanumeric_code(length: Optional[int] = 10) -> str:
    alnum_code = get_random_string(
        length=length,
        allowed_chars=string.ascii_letters + string.digits,
    )
    return alnum_code


def delete_records_from_model(model: django.db.models.base.ModelBase) -> None:
    """Deletes all records from the given Django model"""
    model.objects.all().delete()
    return None


def get_records_from_model(model: django.db.models.base.ModelBase) -> List[Dict[str, Any]]:
    """Gets all records from the given Django model"""
    return list(model.objects.all().values())