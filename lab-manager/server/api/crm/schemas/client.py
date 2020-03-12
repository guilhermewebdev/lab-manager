from graphene_django import types
import graphene
from graphene import relay
from graphene_django.rest_framework import mutation
from crm import models

class TelephoneType(types.DjangoObjectType):

    class Meta:
        model = models.Telephone
        fields = (
            'id',
            'index',
            'telephone',
            'registration_date',
        )

class ClientType(types.DjangoObjectType):
    telephones = graphene.List(TelephoneType)

    def resolve_telephones(parent, info, **kwargs):
        return parent.telephones.filter(**kwargs).all().iterator()

    class Meta: 
        model = models.Client
        fields = (
            'id',
            'index',
            'name',
            'address',
            'email',
            'telephones',
            'stage_funnel',
            'registration_date',
            'discount',
        )

class ClientQuery(types.ObjectType):
    clients = graphene.List(ClientType)
    client = graphene.Field(
        ClientType,
        index=graphene.Int(required=True),
        id=graphene.ID(),
        pk=graphene.ID(),
    )
    
    def resolve_clients(parent, info, **kwargs):
        return parent.clients.filter(**kwargs).all().iterator()

    def resolve_client(parent, info, **kwargs):
        return parent.clients.get(**kwargs)

class TelephoneInput(graphene.InputObjectType):
    telephone = graphene.String(required=True)

class ClientInput(graphene.InputObjectType):
    index = graphene.Int()
    lab = graphene.ID(required=True)
    name = graphene.String(required=True)
    telephones = graphene.List(TelephoneInput)
    address = graphene.String()
    email = graphene.String()
    stage_funnel = graphene.ID()
    discount = graphene.Float()

class ClientMutation(graphene.Mutation):
    client = graphene.Field(ClientType)

    @staticmethod
    def mutate(root, info, input):
        telephones = []
        client = None
        if 'telephones' in input:
            telephones = input.pop('telephones')
        if 'index' in input:
            client = models.Client.objects.get(
                lab=input.pop('lab'),
                index=input.pop('index'),
            )
            if telephones != []:
                client.telephones.clear()
                tels = []
                for tel in telephones:
                    tel.append(client.telephone.create(telephone=tel, client=client))
                client.telephone.bulk_create(tels)
            models.Client.objects.filter(
                id=client,
            ).update(**input)
        else:
            print(input)
            client = models.Client(**input)
            client.save()
            if telephones != []:
                tels = []
                for tel in telephones:
                    tels.append(models.Telephone.objects.create(**tel, client=client))
                result = models.Telephone.objects.bulk_create(tels)
        return ClientMutation(client=client)

    class Arguments:
        input = ClientInput(required=True)

        