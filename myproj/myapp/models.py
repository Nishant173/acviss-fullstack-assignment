from django.contrib.auth.models import User
from django.db import models


class Batch(models.Model):
    id = models.UUIDField(verbose_name="Batch ID", unique=True, null=False, primary_key=True)
    name = models.CharField(verbose_name="Batch name", max_length=50, null=False, blank=False, default=None)
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="batch_creator")
    created_at = models.DateTimeField(verbose_name="Created at", null=False, blank=False, default=None)

    class Meta:
        verbose_name = "Batch"
        verbose_name_plural = "Batches"
    
    def __str__(self) -> str:
        return f"{self.id}"


class Code(models.Model):
    id = models.UUIDField(verbose_name="Code ID", unique=True, null=False, primary_key=True)
    code = models.CharField(verbose_name="Code", max_length=10, null=False)
    parent_batch = models.ForeignKey(to=Batch, on_delete=models.CASCADE, related_name="parent_batch")
    created_at = models.DateTimeField(verbose_name="Created at", null=False, blank=False, default=None)

    class Meta:
        verbose_name = "Code"
        verbose_name_plural = "Codes"
    
    def __str__(self) -> str:
        return f"{self.code}"