# Generated by Django 3.0.6 on 2020-05-21 20:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0010_auto_20200512_1831'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='stage_funnel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='clients', to='crm.Stage'),
        ),
    ]