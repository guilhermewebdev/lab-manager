import graphene
from . import  process, procedure, stage, job

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
    uspsert_stage = stage.StageMutation.Field()
    delete_stage = stage.StageDeletion.Field()
    upsert_job = job.JobMutation.Field()
    delete_job = job.JobDeletion.Field()