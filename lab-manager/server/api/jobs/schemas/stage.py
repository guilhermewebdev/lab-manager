from graphene_django import types
import graphene
from . import procedure, process
from jobs import models

class StageType(types.DjangoObjectType):
    procedure = graphene.Field(procedure.ProcedureType)
    process = graphene.Field(process.ProcessType)

    def resolve_procedure(parent, info, **kwargs):
        return parent.procedure

    def resolve_process(parent, info, **kwargs):
        return parent.process

    class Meta:
        model = models.Stage
        fields = (
            'index',
            'procedure',
            'price',
            'process',
            'registration_date',
            'get_default_price',
        )