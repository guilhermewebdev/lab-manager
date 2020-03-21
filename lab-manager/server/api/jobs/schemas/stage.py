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

