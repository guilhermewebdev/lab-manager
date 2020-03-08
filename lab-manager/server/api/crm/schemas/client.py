from graphene_django import types
import graphene
from graphene_django.rest_framework import mutation
from crm import models, serializers

class ClientType(types.DjangoObjectType):

    class Meta: 
        model = models.Client
        fields = (
            'id',
            'index',
            'name',
            'address',
            'email',
            'stage_funnel',
            'registration_date',
            'discount',
        )

class ClientQuery(types.ObjectType):
    clients = graphene.List(ClientType)
    client = graphene.Field(
        ClientType,
        index=graphene.Int(required=True)
    )
    
    def resolve_clients(parent, info, **kwargs):
        return parent.clients.filter(**kwargs).all()

    def resolve_client(parent, info, **kwargs):
        return parent.clients.get(**kwargs)

class ClientMutation(mutation.SerializerMutation):
    client = graphene.Field(ClientType)

    class Meta:
        serializer_class = serializers.ClientSerializer
        model_operations = ('create', 'update')
        lookup_field = 'index'