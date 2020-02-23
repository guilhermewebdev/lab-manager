import graphene
from labs import schema as labs
from graphene_django.debug import DjangoDebug


class Query(
    graphene.ObjectType,
    labs.Query,
):
    debug = graphene.Field(DjangoDebug, name="_debug")


schema = graphene.Schema(query=Query)