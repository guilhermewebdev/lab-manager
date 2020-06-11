import graphene
from labs import schemas as labs
from graphene_django.debug import DjangoDebug
from crm import schemas as crm
from jobs import schemas as jobs
import graphql_jwt
from .middlewares import set_laboratory

class Query(
    graphene.ObjectType,
    labs.Query,
    labs.PublicQuery,
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class Mutation(
    labs.Mutation,
    crm.Mutation,
    jobs.Mutation,
    graphene.ObjectType,
    labs.PublicMutation,
):
    debug = graphene.Field(DjangoDebug, name="_debug")
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    logout = graphql_jwt.Revoke.Field()

class Subscription(graphene.ObjectType):
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)