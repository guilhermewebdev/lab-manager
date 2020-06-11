from django.test import TestCase
from api.testecase import MyTestCase
from . import models
from labs import models as labs

class ClientTestCase(MyTestCase):

    def setUp(self):
        self.lab = labs.Laboratory.objects.create(name='Teste')
        self.lab.save()
        self.professional = labs.Professional.objects.create_user(username='teste')
        self.professional.save()
        self.professional.labs.add(self.lab)
        self.client.authenticate(self.professional)

    def test_create(self):
        variables = {
            'lab': 0,
            'name': 'Dentista modelo',
            'telephones': ['(32) 3333-3333',],
            'address': 'Address Place',
            'email': 'teste@teste.com',
            'discount': 0
        }
        executed = self.client.execute('''
            mutation create(
                $lab: ID!,
                $name: String!
                $telephones: [String]!,
                $address: String,
                $email: String,
                $discount: Float
            ){
                upsertClient(input: {
                    lab: $lab
                    name: $name
                    telephones: $telephones
                    address: $address
                    email: $email
                    discount: $discount
                }) {
                    client {
                        name
                        telephones {
                            telephone
                        }
                    }
                }
            }
        ''', variables=variables)

        assert executed == {
            'data': {
                'upsertClient': {
                    'client': {
                        'name': variables['name'],
                        'telephones':[
                            { 'telephone': variables['telephones'][0] }
                        ]
                    }
                }
            }
        }