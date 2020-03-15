import graphene
from . import client, patient

class Query(
    client.ClientQuery
):
    pass

class Mutation(graphene.ObjectType):
    upsert_client = client.ClientMutation.Field()
    delete_client = client.ClientDeletion.Field()
    upsert_patient = patient.PatientMutation.Field()