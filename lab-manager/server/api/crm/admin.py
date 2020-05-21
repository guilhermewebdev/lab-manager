from django.contrib import admin
from . import models
from jobs import models as jobs

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
    list_filter = (
        'lab__name',
    )


class JobsInline(admin.StackedInline):
    extra = 1
    model = jobs.Job

    def get_fields(self, request, obj=None):
        if obj:
            return super(JobsInline, self).get_fields(request, obj)
        return ('kind', 'amount', 'deadline', 'price', 'description')

@admin.register(models.Patient)
class PatientAdmint(admin.ModelAdmin):
    inlines = [
        JobsInline
    ]