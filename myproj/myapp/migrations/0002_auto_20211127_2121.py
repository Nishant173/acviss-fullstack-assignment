# Generated by Django 3.2.9 on 2021-11-27 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='batch',
            name='created_at',
            field=models.DateTimeField(default=None, verbose_name='Created at'),
        ),
        migrations.AddField(
            model_name='code',
            name='created_at',
            field=models.DateTimeField(default=None, verbose_name='Created at'),
        ),
    ]
