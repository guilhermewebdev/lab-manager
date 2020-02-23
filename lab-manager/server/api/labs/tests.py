from django.test import TestCase

# Create your tests here.
import json
from graphene_django.utils.testing import GraphQLTestCase
from api.schema import schema
from .schema import auth_schema

class RegistrationTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = auth_schema


class ApiTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = schema