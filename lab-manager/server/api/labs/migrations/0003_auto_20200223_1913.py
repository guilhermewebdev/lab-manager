# Generated by Django 3.0.3 on 2020-02-23 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0002_auto_20200223_1719'),
    ]

    operations = [
        migrations.AlterField(
            model_name='professional',
            name='labs',
            field=models.ManyToManyField(blank=True, help_text='The labs this user belongs to. A user will get all permissions granted to each of their groups.', related_name='professionals', related_query_name='user', to='labs.Laboratory', verbose_name='groups'),
        ),
    ]
