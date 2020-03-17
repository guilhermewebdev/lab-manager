import graphene
from . import procedure

class Query(
    procedure.ProcedureQuery
):
    pass

class Mutation(graphene.ObjectType):
    upsert_procedure = procedure.ProcedureMutation.Field()
    delete_procedure = procedure.ProcedureDeletion.Field()