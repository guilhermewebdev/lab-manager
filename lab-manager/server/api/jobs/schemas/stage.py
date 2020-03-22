from graphene_django import types
import graphene
from jobs import models

class StageType(types.DjangoObjectType):

    class Meta:
        model = models.Stage
        fields = (
            'procedure',
            'index',
            'price',
            'process',
            'registration_date',
            'id',
        )

class StageQuery:
    stages = graphene.List(StageType)
    stage = graphene.List(
        StageType,
        index=graphene.Int(),
        process__lab=graphene.Int(),
        process=graphene.ID(),
    )

    def resolve_stages(parent, info, **kwargs):
        return parent.stages.filter(**kwargs).all().iterator()

    def resolve_stage(parent, info, **kwargs):
        return parent.stages.get(**kwargs)

class StageInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    lab = graphene.Int(required=True)
    procedure = graphene.Int(required=True)
    price = graphene.Float()
    process = graphene.Int(required=True)

class StageMutation(graphene.Mutation):
    stage = graphene.Field(StageType)
    created = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        data = dict(
            index=input['index'],
            procedure__lab=input['lab'],
            procedure__index=input['procedure'],
            process__lab=input['lab'],
            process__index=input['process'],
        )
        if 'price' in input: data['price'] = input['price']
        stage, created = models.Stage.objects.update_or_create(**data)
        return StageMutation(
            stage=stage,
            created=created,
        )

    class Arguments:
        input = StageInput(required=True)

class StageInputDeletion(graphene.InputObjectType):
    index = graphene.Int(required=True)
    process = graphene.Int(required=True)
    lab = graphene.Int(required=True)

class StageDeletion(graphene.Mutation):
    ok = graphene.Boolean(required=True)

    @staticmethod
    def mutate(root, info, input):
        return StageDeletion(
            ok=models.Stage.objects.filter(
                index=input['index'],
                process__index=input['process'],
                process__lab=input['lab']
            )[0]
        )

    class Arguments:
        input = None