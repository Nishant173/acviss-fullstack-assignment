from datetime import datetime
from typing import Any, Dict, List
import uuid

from django.contrib.auth.models import User

from myapp.decorators import timer
from myapp.models import Batch, Code
from .utils import generate_alphanumeric_code, generate_random_uuid


ListOfDicts = List[Dict[Any, Any]]


def get_batches_data(user_id: int) -> ListOfDicts:
    return list(Batch.objects.filter(creator=user_id).order_by('created_at').values())


def get_codes_data(batch_id_subset: List[uuid.UUID]) -> ListOfDicts:
    fields = ['id', 'code', 'created_at', 'parent_batch__id', 'parent_batch__name', 'parent_batch__creator__username']
    return list(Code.objects.filter(parent_batch__id__in=batch_id_subset).order_by('created_at').values(*fields))


@timer
def create_batch_and_corresponding_codes(
        creator_user_id: int,
        batch_name: str,
        num_codes: int,
    ) -> None:
    """Creates one batch, along with it's corresponding codes"""
    dt_now = datetime.now()
    user = User.objects.get(id=creator_user_id)
    batch = Batch.objects.create(
        id=generate_random_uuid(),
        name=batch_name,
        creator=user,
        created_at=dt_now,
    )
    codes = [
        Code(
            id=generate_random_uuid(),
            code=generate_alphanumeric_code(),
            parent_batch=batch,
            created_at=dt_now,
        ) for _ in range(num_codes)
    ]
    _ = Code.objects.bulk_create(objs=codes, ignore_conflicts=False)
    return None