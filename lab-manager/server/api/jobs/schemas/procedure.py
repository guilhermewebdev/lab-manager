from graphene_django import types
import graphene
from jobs import models
from . import stage
from graphql_jwt.decorators import login_required

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
            'need_color',
        )

class ProcedureQuery:
    procedures = graphene.List(ProcedureType)
    procedure = graphene.Field(ProcedureType)

    @login_required
    def resolve_procedures(parent, info, **kwargs):
        return parent.procedures.filter(**kwargs).all().iterator()

    @login_required
    def resolve_procedure(parent, info, **kwargs):
        return parent.procedures.get(**kwargs)

class ProcedureInput(graphene.InputObjectType):
    index = graphene.Int()
    lab = graphene.Int(required=True)
    name = graphene.String(required=True)
    need_color = graphene.Boolean(required=True)
    description = graphene.String()
    price = graphene.Float(required=True)

class ProcedureMutation(graphene.Mutation):
    procedure = graphene.Field(ProcedureType)
    created = graphene.Boolean()

    @staticmethod
    @login_required
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

class ProcedureDeletionInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    lab = graphene.Int(required=True)

class ProcedureDeletion(graphene.Mutation):
    ok = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        return ProcedureDeletion(
            ok=bool(
                models.Procedure.objects.filter(**input).delete()[0]
            )
        )

    class Arguments:
        input = ProcedureDeletionInput()