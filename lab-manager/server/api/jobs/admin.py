from django.contrib import admin
from . import models

class StageTabularInline(admin.TabularInline):
    model = models.Stage
    extra = 1

@admin.register(models.Process)
class ProcessAdmin(admin.ModelAdmin):
    inlines = [StageTabularInline]
    list_filter = (
        'lab__name',
    )

@admin.register(models.Procedure)
class ProcedureAdmin(admin.ModelAdmin):
    list_filter = (
        'lab__name',
    )

@admin.register(models.Job)
class JobAdmin(admin.ModelAdmin):
    list_filter = (
        'patient__client__lab__name',
        'patient__client',
        'patient',
    )
    search_fields = (
        'kind__description',
        'kind__name',
        'name',
        'patient__name',
        'patient__client__name',
        'patient__client__lab__name'
    )
    ordering = ['index', 'patient']

@admin.register(models.Proof)
class ProofAdmin(admin.ModelAdmin):
    list_filter = (
        'job',
        'job__patient',
        'job__patient__client',
        'job__patient__client__lab__name'
    )
    search_fields = (
        'job',
        'job__kind__name',
        'job__patient__name',
        'job__patient__client__name',
    )