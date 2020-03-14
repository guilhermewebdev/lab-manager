from django.contrib import admin
from . import models

class TelephonesInline(admin.TabularInline):
    extra = 1
    model = models.Telephone

class PatientsInline(admin.TabularInline):
    extra = 1
    model = models.Patient

@admin.register(models.Client)
class ClientAdmin(admin.ModelAdmin):
    inlines = [
        TelephonesInline,
        PatientsInline,
    ]

