from graphene_django import types
import graphene
from jobs import models

class ProcessType(types.DjangoObjectType):

    class Meta:
        model = models.Process
        fields = (
            'index',
            'id',
            'name',
            'description',
            'price',
            'registration_date',
            'get_default_price',
        )

class ProcessQuery(types.ObjectType):
    processes = graphene.List(ProcessType)
    process = graphene.Field(ProcessType)

    def resolve_processes(parent, info, **kwargs):
        return parent.processes.filter(**kwargs).all().iterator()

    def resolve_process(parent, info, **kwargs):
        return parent.processes.get(**kwargs)

class ProcessInput(graphene.InputObjectType):
    index = graphene.Int()
    name = graphene.String()
    description = graphene.String()
    price = graphene.Float()

class ProcessMutation(graphene.Mutation):
    process = graphene.Field(ProcessType)
    created = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        obj = None
        created = False
        if 'index' in input:
            obj = models.Process.objects.get(
                index=input.pop('index'),
                lab=input.pop('lab'),
            )
            for key, value in input.items():
                setattr(obj, key, value)
        else:
            obj = models.Process(**input)
            created = True
        obj.save()
        return ProcessMutation(
            process=obj,
            created=created,
        )