from graphene_django import types
import graphene
from jobs import models

class StageType(types.DjangoObjectType):

    class Meta:
        model = models.Stage
        fields = (
            'index',
            'procedure',
            'price',
            'process',
            'registration_date',
            'get_default_price',
        )