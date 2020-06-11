from graphene_django import types
import graphene
from jobs import models
from . import stage
from graphql_jwt.decorators import login_required
from django.db.models import Q
import functools 
from operator import or_


class ProcessType(
    types.DjangoObjectType,
    stage.StageQuery,
):

    class Meta:
        model = models.Process
        fields = (
            'index',
            'id',
            'name',
            'description',
            'price',
            'stages',
            'stage',
            'is_custom',
            'need_color',
            'registration_date',
        )


class ProcessQuery:
    processes = graphene.List(ProcessType)
    process = graphene.Field(ProcessType)

    @staticmethod
    @login_required
    def resolve_processes(parent, info, **kwargs):
        return parent.processes.filter(**kwargs).all().iterator()

    @staticmethod
    @login_required
    def resolve_process(parent, info, **kwargs):
        return parent.processes.get(**kwargs)


class StageProcessInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    procedure = graphene.Int(required=True)
    price = graphene.Float()


class ProcessInput(graphene.InputObjectType):
    index = graphene.Int()
    name = graphene.String(rquired=True)
    description = graphene.String()
    price = graphene.Float()
    need_color = graphene.Boolean()
    lab = graphene.Int(required=True)
    stages = graphene.List(StageProcessInput)


class ProcessMutation(graphene.Mutation):
    process = graphene.Field(ProcessType)
    created = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        process: models.Process = None
        created: bool = False
        stages: list = []
        if 'stages' in input:
            stages = input.pop('stages')
        if 'index' in input:
            process = models.Process.objects.get(
                index=input.pop('index'),
                lab=input['lab'],
            )
            for key, value in input.items():
                setattr(process, key, value)
        else:
            process = models.Process(**input)
            created = True
        process.save()
        query = functools.reduce(
                lambda x, y: x | y, 
                map(lambda stage: Q(index=stage['procedure']), stages)
            )
        procedures = list(models.Procedure.objects.filter(query, lab=input['lab']))
        def set_stage(stage):
            stg: dict = dict(
                process=process,
                procedure=list(filter(lambda item: item.index == stage['procedure'], procedures))[0],
                index=stage['index'],
                price=False,
            )
            if 'price' in stage:
                stg['price'] = stage['price']
            return stg
        if created:
            stgs: list = []
            for stage in stages:
                stgs.append(models.Stage(
                    **set_stage(stage),
                ))
            models.Stage.objects.bulk_create(stgs)
        else:
            for stage in stages:
                models.Stage.objects.update_or_create(
                    **set_stage(stage)
                )
        return ProcessMutation(
            process=process,
            created=created,
        )

    class Arguments:
        input = ProcessInput(required=True)


class ProcessDeletionInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    lab = graphene.Int(required=True)


class ProcessDeletion(graphene.Mutation):
    ok = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        return ProcessDeletion(
            ok=bool(
                models.Process.objects.filter(
                    **input,
                ).delete()[0]
            )
        )

    class Arguments:
        input = ProcessDeletionInput()
