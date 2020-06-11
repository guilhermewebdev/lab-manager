# Generated by Django 3.0.6 on 2020-05-21 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
        ('labs', '0007_auto_20200317_0014'),
    ]

    operations = [
        migrations.AddField(
            model_name='professional',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
    ]
