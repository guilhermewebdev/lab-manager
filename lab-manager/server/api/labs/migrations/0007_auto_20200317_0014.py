# Generated by Django 3.0.4 on 2020-03-17 00:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0006_auto_20200224_0408'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='index',
            field=models.IntegerField(blank=True, editable=False, verbose_name='Índice'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='role',
            unique_together={('index', 'lab')},
        ),
    ]
