# Generated by Django 3.0.6 on 2020-05-12 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0009_auto_20200422_0554'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='tooth_color',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Cor dos dentes'),
        ),
    ]
