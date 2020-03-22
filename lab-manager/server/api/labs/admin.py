from django.contrib import admin
from . import models

@admin.register(models.Laboratory)
class LaboratoryAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Role)
class RoleAdmin(admin.ModelAdmin):
    list_filter = (
        'lab__name'
    )

@admin.register(models.Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    pass