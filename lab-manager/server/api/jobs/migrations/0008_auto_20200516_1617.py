# Generated by Django 3.0.6 on 2020-05-16 16:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0007_process_need_color'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='stage',
            unique_together={('process', 'index')},
        ),
    ]
