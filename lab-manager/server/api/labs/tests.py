from django.test import TestCase

# Create your tests here.
import json
from . import models

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