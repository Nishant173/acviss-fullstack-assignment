# Generated by Django 3.2.9 on 2021-11-27 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_batch_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='id',
            field=models.UUIDField(primary_key=True, serialize=False, unique=True, verbose_name='Code ID'),
        ),
    ]
