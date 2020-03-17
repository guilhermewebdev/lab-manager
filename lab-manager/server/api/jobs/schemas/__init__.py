import graphene
from . import procedure, process

class Query(
    procedure.ProcedureQuery,
    process.ProcessQuery,
):
    pass

class Mutation(graphene.ObjectType):
    upsert_procedure = procedure.ProcedureMutation.Field()
    delete_procedure = procedure.ProcedureDeletion.Field()
    upsert_process = process.ProcessMutation.Field()
    delete_process = process.ProcessDeletion.Field()