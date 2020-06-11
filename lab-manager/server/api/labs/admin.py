from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models

@admin.register(models.Laboratory)
class LaboratoryAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Role)
class RoleAdmin(admin.ModelAdmin):
    list_filter = (
        'lab__name',
    )

@admin.register(models.Professional)
class ProfessionalAdmin(UserAdmin):
    
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj=obj)
        return (
            (None, {
                'fields': ('full_name', 'labs')
            }),
            *fieldsets
        )