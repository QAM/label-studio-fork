# Generated by Django 3.2.20 on 2023-10-05 23:38

from django.db import migrations
import django.db.models.manager
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_user_is_deleted'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', django.db.models.manager.Manager()),
            ],
        ),
    ]
