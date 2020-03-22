import graphene
from labs import schemas as labs
from graphene_django.debug import DjangoDebug
from .middlewares import set_laboratory
from crm import schemas as crm
from jobs import schemas as jobs
import graphql_jwt

class Query(
    graphene.ObjectType,
    labs.Query,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class Mutation(
    labs.Mutation,
    crm.Mutation,
    jobs.Mutation,
    graphene.ObjectType,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

schema = graphene.Schema(query=Query, mutation=Mutation)

class PublicQuery(
    labs.PublicQuery,
    graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class PublicMutation(
    labs.PublicMutation,
    graphene.ObjectType,
):
    debug = graphene.Field(DjangoDebug, name="_debug")
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

public_schema = graphene.Schema(mutation=PublicMutation, query=PublicQuery)