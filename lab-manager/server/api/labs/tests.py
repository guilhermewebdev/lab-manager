from django.test import TestCase

# Create your tests here.
import json
from graphene_django.utils.testing import GraphQLTestCase
from api.schema import schema, public_schema
from .schema import auth_schema

class PublicTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = public_schema

class ApiTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = schema