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

class PatientInput(graphene.InputObjectType):
    index = graphene.Int()
    client = graphene.ID(required=True)
    lab = graphene.Int(required=True)
    name = graphene.String(required=True)    

class PatientMutation(graphene.Mutation):
    patient = graphene.Field(PatientType)
    created = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        input['client'] = models.Client.objects.get(
            index=input.pop('client'),
            lab=input.pop('lab')
        )
        print(input)
        obj = None
        created = False
        if 'index' in input:
            obj = models.Patient.objects.get(
                index=input.pop('index'),
                client=input.pop('client'),
            )
            for key, value in input.items():
                setattr(obj, key, value)
            obj.save()
        else:
            obj = models.Patient(**input)
            obj.save()
            created = True            
        return PatientMutation(patient=obj, created=created)

    class Arguments:
        input = PatientInput()

class PatientDeletionInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    lab = graphene.Int(required=True)
    client = graphene.Int(required=True)

class PatientDeletion(graphene.Mutation):
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        return PatientDeletion(
            ok=bool(
                models.Patient.objects.filter(
                    client__index=input['client'],
                    client__lab=input['lab'],
                    index=input['index']
                ).delete()[0]
            )
        )

    class Arguments:
        input = PatientDeletionInput(required=True)