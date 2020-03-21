from django.contrib import admin
from . import models

class StageTabularInline(admin.TabularInline):
    model = models.Stage
    extra = 1

@admin.register(models.Process)
class ProcessAdmin(admin.ModelAdmin):
    inlines = [StageTabularInline]