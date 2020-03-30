from graphene_django import types
import graphene
from jobs import models
from . import stage
from graphql_jwt.decorators import login_required

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
            'registration_date',
        )

class ProcessQuery:
    processes = graphene.List(ProcessType)
    process = graphene.Field(ProcessType)

    @login_required
    def resolve_processes(parent, info, **kwargs):
        return parent.processes.filter(**kwargs).all().iterator()

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
    lab = graphene.Int(required=True)
    stages = graphene.List(StageProcessInput)

class ProcessMutation(graphene.Mutation):
    process = graphene.Field(ProcessType)
    created = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        process:models.Process = None
        created:bool = False
        stages:list = []
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
        def set_stage(stage):
            stg:dict = dict(
                process=process,
                procedure=models.Procedure.objects.get(
                    lab=input['lab'],
                    index=stage['procedure']
                ),
                index=stage['index'],
                price=False,
            )
            if 'price' in stage: stg['price'] = stage['price']
            return stg
        if created:
            stgs:list = []
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