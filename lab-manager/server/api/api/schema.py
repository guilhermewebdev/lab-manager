import graphene
from labs import schemas as labs
from graphene_django.debug import DjangoDebug
from .middlewares import set_laboratory
from crm import schemas as crm

class Query(
    graphene.ObjectType,
    labs.Query,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class Mutation(
    labs.Mutation,
    crm.Mutation,
    graphene.ObjectType,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

schema = graphene.Schema(query=Query, mutation=Mutation)

class PublicQuery(
    graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class PublicMutation(
    labs.PublicMutation,
    graphene.ObjectType,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

public_schema = graphene.Schema(mutation=PublicMutation)