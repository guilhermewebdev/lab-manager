# Generated by Django 3.0.6 on 2020-05-21 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0009_proof'),
    ]

    operations = [
        migrations.AlterField(
            model_name='process',
            name='name',
            field=models.CharField(max_length=200, verbose_name='Nome'),
        ),
    ]
