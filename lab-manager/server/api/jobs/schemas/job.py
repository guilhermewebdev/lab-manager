from graphene_django import types
import graphene
from jobs import models

class JobType(types.DjangoObjectType):
    model = models.Job
    fields = (
        'index',
        'id',
        'name',
        'description',
        'price',
        'registration_date',
        'kind',
        'patient',
        'arrival',
        'started',
        'finished',
        'delivered',
        'deadline',
    )