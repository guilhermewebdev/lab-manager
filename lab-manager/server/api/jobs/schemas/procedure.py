from graphene_django import types
import graphene
from jobs import models

class ProcedureType(types.DjangoObjectType):

    class Meta:
        model = models.Procedure
        fields = (
            'index',
            'id',
            'name',
            'description',
            'price',
            'registration_date',
        )

class ProcedureQuery(types.ObjectType):
    procedures = graphene.List(ProcedureType)
    procedure = graphene.Field(ProcedureType)

    def resolve_procedures(parent, info, **kwargs):
        return parent.procedures.filter(**kwargs).all().iterator()

    def resolve_procedure(parent, info, **kwargs):
        return parent.procedures.get(**kwargs)

class ProcedureInput(graphene.InputObjectType):
    index = graphene.Int()
    lab = graphene.Int(required=True)
    name = graphene.String(required=True)
    description = graphene.String()
    price = graphene.Float(required=True)

class ProcedureMutation(graphene.Mutation):
    procedure = graphene.Field(ProcedureType)
    created = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        obj = None
        created = False
        if 'index' in input:
            obj = models.Procedure.objects.get(
                index=input.pop('index'),
                lab=input.pop('lab'),
            )
            for key, value in input.items():
                setattr(obj, key, value)
        else:
            obj = models.Procedure(**input)
            created = True
        obj.save()
        return ProcedureMutation(
            procedure=obj,
            created=created,
        )
    
    class Arguments:
        input = ProcedureInput()