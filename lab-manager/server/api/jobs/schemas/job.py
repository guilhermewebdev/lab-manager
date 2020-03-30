from graphene_django import types
import graphene
from jobs import models
from crm.models import Patient
from graphql_jwt.decorators import login_required

class JobType(types.DjangoObjectType):

    class Meta:
        model = models.Job
        fields = (
            'index',
            'id',
            'name',
            'description',
            'price',
            'registration_date',
            'kind',
            'patient',
            'arrival',
            'started',
            'finished',
            'delivered',
            'deadline',
        )

class JobQuery:
    jobs = graphene.List(JobType)
    job = graphene.Field(
        JobType,
        index=graphene.Int(required=True),
        lab=graphene.Int(required=True),
    )

    @login_required
    def resolve_jobs(parent, info, **kwargs):
        return parent.jobs.filter(**kwargs).all().iterator()

    @login_required
    def resolve_job(parent, info, **kwargs):
        return parent.jobs.get(**kwargs)

class JobInput(graphene.InputObjectType):
    index = graphene.Int()
    name = graphene.String(required=True)
    description = graphene.String()
    price = graphene.Float()
    kind = graphene.Int(required=True)
    patient = graphene.Int(required=True)
    client = graphene.Int(required=True)
    lab = graphene.Int(required=True)
    arrival = graphene.DateTime()
    started = graphene.DateTime()
    finished = graphene.DateTime()
    delivered = graphene.DateTime()
    deadline = graphene.DateTime(required=True)

class JobMutation(graphene.Mutation):
    job = graphene.Field(JobType)
    created = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        job = None
        created = False
        input['kind'] = models.Process.objects.get(
            index=input.pop('kind'),
            lab=input['lab']
        )
        input['patient'] = Patient.objects.get(
            index=input.pop('patient'),
            client__lab=input['lab'],
            client__index=input.pop('client')
        )
        if 'index' in input:
            job = models.Job.objects.get(
                index=input.pop('index'),
                lab=input.pop('lab'),
            )            
            for key, value in input.items():
                setattr(job, key, value)
        else:
            input.pop('lab')
            job = models.Job(**input)
            created = True
        job.save()
        return JobMutation(
            job=job,
            created=created
        )

    class Arguments:
        input = JobInput(required=True)

class JobInputDeletion(graphene.InputObjectType):
    index = graphene.Int(required=True)
    patient = graphene.Int(required=True)
    client = graphene.Int(required=True)
    lab = graphene.Int(required=True)

class JobDeletion(graphene.Mutation):
    ok = graphene.Boolean(required=True)

    @staticmethod
    @login_required
    def mutate(root, info, input):
        return JobDeletion(
            ok=models.Job.objects.filter(
                index=input['index'],
                patient__index=input['patient'],
                patient__client__index=input['patient'],
                patient__client__lab=input['patient'],
            ).delete()[0]
        )

    class Arguments:
        input = JobInputDeletion(required=True)