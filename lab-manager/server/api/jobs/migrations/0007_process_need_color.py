# Generated by Django 3.0.6 on 2020-05-12 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0006_auto_20200512_1646'),
    ]

    operations = [
        migrations.AddField(
            model_name='process',
            name='need_color',
            field=models.BooleanField(verbose_name='Precisa da cor do dente'),
            preserve_default=False,
        ),
    ]