# Generated by Django 3.0.4 on 2020-03-17 00:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
        ('crm', '0005_auto_20200312_0457'),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseJob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Trabalho')),
                ('description', models.TextField(blank=True, max_length=300, null=True, verbose_name='Descrição')),
                ('price', models.FloatField(verbose_name='Preço')),
                ('registration_date', models.DateField(auto_now=True, verbose_name='Data de cadastro')),
            ],
            options={
                'required_db_vendor': 'postgresql',
            },
        ),
        migrations.CreateModel(
            name='Procedure',
            fields=[
                ('basejob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='jobs.BaseJob')),
                ('index', models.IntegerField(blank=True, editable=False, verbose_name='índice')),
                ('lab', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='procedures', to='auth.Group')),
            ],
            options={
                'verbose_name': 'Procedimento',
                'verbose_name_plural': 'Procedimentos',
                'ordering': ('-registration_date', 'lab'),
                'unique_together': {('index', 'lab')},
            },
            bases=('jobs.basejob',),
        ),
        migrations.CreateModel(
            name='Process',
            fields=[
                ('basejob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='jobs.BaseJob')),
                ('is_custom', models.BooleanField(default=False, verbose_name='É customizado?')),
                ('index', models.IntegerField(blank=True, editable=False, verbose_name='índice')),
                ('lab', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='processes', to='auth.Group')),
            ],
            options={
                'verbose_name': 'Processo',
                'verbose_name_plural': 'Processos',
                'ordering': ('-registration_date', 'lab'),
                'unique_together': {('index', 'lab')},
            },
            bases=('jobs.basejob',),
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField(blank=True, verbose_name='Índice')),
                ('price', models.FloatField(verbose_name='Preço')),
                ('registration_date', models.DateField(auto_now=True, verbose_name='Data de cadastro')),
                ('procedure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stages', to='jobs.Procedure')),
                ('process', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stages', to='jobs.Process')),
            ],
            options={
                'ordering': ['index', 'process'],
                'unique_together': {('process', 'index')},
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('basejob_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='jobs.BaseJob')),
                ('arrival', models.DateTimeField(auto_now_add=True, verbose_name='Data da chegada')),
                ('started', models.DateTimeField(blank=True, null=True, verbose_name='Data de início')),
                ('finished', models.DateTimeField(blank=True, null=True, verbose_name='Data da finalização')),
                ('delivered', models.DateField(blank=True, null=True, verbose_name='Data da entrega')),
                ('deadline', models.DateTimeField(verbose_name='Prazo de entrega')),
                ('index', models.IntegerField(blank=True, editable=False, verbose_name='índice')),
                ('kind', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='kind', to='jobs.Process')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='jobs', to='crm.Patient')),
            ],
            options={
                'verbose_name': 'Trabalho',
                'verbose_name_plural': 'Trabalho',
                'ordering': ('-registration_date', 'patient'),
                'unique_together': {('index', 'patient')},
            },
            bases=('jobs.basejob',),
        ),
    ]
