from django.test import TestCase

# Create your tests here.
import json
from . import models
from api.testecase import MyTestCase

class RegistrationTestCase(TestCase):

    def test_registration(self):
        lab = models.Laboratory.objects.create(
            name='Teste'
        )
        lab.save()
        self.assertIsNotNone(lab.id)

        professional = models.Professional.objects.create_user(
            username='teste',
            email='teste@teste.com',
            password='senha54546',
        )
        professional.labs.add(lab)
        professional.save()

        self.assertIsNotNone(professional.id)

class RegistrationGraphQLTestCase(MyTestCase):

    def test_registration(self):
        variables = {
            'fullName': 'Teste da Silva',
            'username': 'teste',
            'email': 'teste@teste.com',
            'password': 'pass534623',
            'laboratory': 'Teste'
        }
        executed = self.client.execute('''
            mutation registration(
                $fullName: String!
                $username: String!
                $email: String!
                $password: String!
                $laboratory: String!
            ){
                register(input: {
                    fullName: $fullName
                    username: $username
                    email: $email
                    password: $password
                    laboratory: $laboratory
                }) {
                    professional {
                        username
                    }
                    laboratory {
                        name
                    }
                }
            }
        ''', variables=variables)

        assert executed == {
            'data': {
                'register': {
                    'professional': {
                        'username': variables['username']
                    },
                    'laboratory': {
                        'name': variables['laboratory']
                    },
                }
            }
        }