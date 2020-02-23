# Generated by Django 3.0.3 on 2020-02-23 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0003_auto_20200223_1913'),
    ]

    operations = [
        migrations.AlterField(
            model_name='professional',
            name='labs',
            field=models.ManyToManyField(blank=True, help_text='The labs this user belongs to. A user will get all permissions granted to each of their groups.', related_name='professionals', related_query_name='professional', to='labs.Laboratory', verbose_name='groups'),
        ),
    ]
