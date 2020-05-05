import graphene
from . import client, patient

class Query(
    client.ClientQuery
):
    pass

class Mutation(
    graphene.ObjectType,
    client.Mutation,
):
    upsert_client = client.ClientMutation.Field()
    delete_client = client.ClientDeletion.Field()
    upsert_patient = patient.PatientMutation.Field()
    delete_patient = patient.PatientDeletion.Field()