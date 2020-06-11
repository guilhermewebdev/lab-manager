# Generated by Django 3.0.6 on 2020-05-21 19:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0008_auto_20200516_1617'),
    ]

    operations = [
        migrations.CreateModel(
            name='Proof',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('departure', models.DateTimeField(auto_now=True, verbose_name='Saída')),
                ('arrival', models.DateTimeField(verbose_name='Retorno')),
                ('description', models.CharField(max_length=200, null=True)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proofs', to='jobs.Job')),
                ('stage', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='proofs', to='jobs.Stage')),
            ],
            options={
                'verbose_name': 'Prova',
                'verbose_name_plural': 'Provas',
            },
        ),
    ]
