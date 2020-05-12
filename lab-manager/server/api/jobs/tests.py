from django.test import TestCase
from . import models
from labs import models as labs
from crm import models as crm
from datetime import date
from django.core.exceptions import ValidationError

class JobsTestCase(TestCase):

    def setUp(self):
        self.lab = labs.Laboratory(
            name='teste'
        )
        self.lab.save()

        self.client = crm.Client(
            name='client1',
            lab=self.lab
        )
        self.client.save()

        self.patient = crm.Patient(
            name='patient1',
            client=self.client
        )
        self.patient.save()

        self.patient2 = crm.Patient(
            name='patient2',
            client=self.client,
            tooth_color='a1',
        )
        self.patient2.save()

        self.procedure = models.Procedure(
            name='procedure1',
            price=30,
            lab=self.lab,
        )
        self.procedure.save()

        self.process = models.Process(
            name='process1',
            need_color=True,
            lab=self.lab,
            price=50,
        )
        self.process.save()

        self.stage = models.Stage(
            procedure=self.procedure,
            process=self.process,
            index=1,
        )
        self.stage.save()

    def test_job_witout_color(self):
        job = models.Job(
            kind=self.process,
            patient=self.patient,
            deadline=date.today(),
            price=500,
        )

        self.assertRaises(ValidationError, job.save)

    def test_job_with_color(self):
        job = models.Job(
            kind=self.process,
            patient=self.patient2,
            deadline=date.today(),
            price=300,
        )

        job.save()