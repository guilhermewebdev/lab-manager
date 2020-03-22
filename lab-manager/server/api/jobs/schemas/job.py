from graphene_django import types
import graphene
from jobs import models

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

    def resolve_jobs(parent, info, **kwargs):
        return parent.jobs.filter(**kwargs).all().iterator()

    def resolve_job(parent, info, **kwargs):
        return parent.jobs.get(**kwargs)

class JobInput(graphene.InputObjectType):
    index = graphene.Int()
    name = graphene.String(required=True)
    description = graphene.String()
    price = graphene.Float()
    kind = graphene.Int(required=True)
    patient = graphene.Int(required=True)
    arrival = graphene.DateTime()
    started = graphene.DateTime()
    finished = graphene.DateTime()
    delivered = graphene.DateTime()
    deadline = graphene.DateTime()
    

