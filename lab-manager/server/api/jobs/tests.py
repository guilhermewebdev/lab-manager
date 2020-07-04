from django.test import TestCase
from . import models
from labs import models as labs
from crm import models as crm
from datetime import date
from django.core.exceptions import ValidationError
from api.testecase import MyTestCase
from api.middlewares import set_laboratory
from datetime import date, datetime
from django.utils import timezone

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


class JobsGraphQLTestCase(MyTestCase):

    def setUp(self):
        self.lab = labs.Laboratory.objects.create(name='Teste')
        self.lab.save()
        self.professional = labs.Professional.objects.create_user(username='teste')
        self.professional.save()
        self.professional.labs.add(self.lab)
        self.client.authenticate(self.professional)
        
        self.procedure = models.Procedure(
            name='teste',
            lab=self.lab,
            price=100,
            need_color=False,
        )
        self.procedure.save()

        self.dentist = crm.Client(
            lab=self.lab,
            name='Teste',
            address='Rua 15',
            email='teste@gmail.com',
        )
        self.dentist.save()

        self.patient = crm.Patient(
            client=self.dentist,
            name='Paciente',
        )
        self.patient.save()
        
        stage = models.Stage(
            index=1,
            procedure=self.procedure,
            price=50,
        )
        stage.save()
        self.process = models.Process(
            name='Teste',
            price=30,
            need_color=False,
            lab=self.lab,
        )
        self.process.save()
        self.process.stages.add(stage)

    def test_create_job_with_custom_process(self):
        executed = self.client.execute('''
            mutation newJob($input: JobInput!) {
                upsertJob(input:$input){
                    created
                    job {
                        price
                        kind {
                            isCustom
                            stages {
                                index
                                price
                                procedure {
                                    name
                                    price
                                }
                            }
                        }
                    }
                }
            }
        ''', variables=dict(
            input=dict(
                process=dict(
                    price=30,
                    stages=[
                        dict(
                            index=1,
                            procedure=self.procedure.index,
                            price=50,
                        )
                    ],
                ),
                patient=self.patient.index,
                client=self.dentist.index,
                lab=0,
                deadline=datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")
            )
        ))
        print(executed)
        assert 'data' in executed
        assert not 'errors' in executed
        assert executed['data']['upsertJob']['created']

    def test_create_job_with_kind(self):
        executed = self.client.execute('''
            mutation newJob($input: JobInput!) {
                upsertJob(input:$input){
                    created
                    job {
                        price
                    }
                }
            }
        ''', variables=dict(
            input=dict(
                kind=self.process.index,
                patient=self.patient.index,
                client=self.dentist.index,
                lab=0,
                deadline=timezone.now()
            )
        ))
        assert 'data' in executed
        assert not 'errors' in executed
        assert executed['data']['upsertJob']['created']



    def test_create_job_with_custom_process_and_kind(self):
        executed = self.client.execute('''
            mutation newJob($input: JobInput!) {
                upsertJob(input:$input){
                    created
                    job {
                        price
                        kind {
                            isCustom
                            stages {
                                index
                                price
                                procedure {
                                    name
                                    price
                                }
                            }
                        }
                    }
                }
            }
        ''', variables=dict(
            input=dict(
                kind=self.process.index,
                process=dict(
                    price=30,
                    stages=[
                        dict(
                            index=2,
                            procedure=self.procedure.index,
                            price=50,
                        )
                    ],
                ),
                patient=self.patient.index,
                client=self.dentist.index,
                lab=0,
                deadline=datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")
            )
        ))
        print(executed)
        assert 'data' in executed
        assert not 'errors' in executed
        assert executed['data']['upsertJob']['created']