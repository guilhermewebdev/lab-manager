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

