import graphene
from . import client

class Query(
    client.ClientQuery
):
    pass

class Mutation(graphene.ObjectType):
    upsert_client = client.ClientMutation.Field()