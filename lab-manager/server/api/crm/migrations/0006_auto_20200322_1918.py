# Generated by Django 3.0.4 on 2020-03-22 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0005_auto_20200312_0457'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='gender',
            field=models.BooleanField(blank=True, null=True, verbose_name='Sexo'),
        ),
        migrations.AddField(
            model_name='patient',
            name='tooth_color',
            field=models.CharField(max_length=100, verbose_name='Cor dos dentes'),
            preserve_default=False,
        ),
    ]
