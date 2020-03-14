from graphene_django import types
import graphene
from graphene import relay
from graphene_django.rest_framework import mutation
from crm import models

class PatientType(types.DjangoObjectType):

    class Meta:
        model = models.Patient
        fields = (
            'name',
            'client',
            'registration_date',
            'index',
            'id',
        )

class PatientQuery(types.ObjectType):
    patients = graphene.List(PatientType)
    patient = graphene.Field(PatientType)

    def resolve_patients(parent, info, **kwargs):
        return parent.patients.filter(**kwargs).all().iterator()

    def resolve_patient(parent, info, **kwargs):
        return parent.patients.get(**kwargs)