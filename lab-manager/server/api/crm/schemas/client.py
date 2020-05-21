from graphene_django import types
import graphene
from graphene import relay
from graphene_django.rest_framework import mutation
from crm import models
from . import patient
from graphql_jwt.decorators import login_required
 
class TelephoneType(types.DjangoObjectType):

    class Meta:
        model = models.Telephone
        fields = (
            'id',
            'index',
            'telephone',
            'registration_date',
        )

class ClientType(
    patient.PatientQuery,
    types.DjangoObjectType
):
    telephones = graphene.List(TelephoneType)
    
    @staticmethod
    @login_required
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
    
    @login_required
    def resolve_clients(parent, info, **kwargs):
        return parent.clients.filter(**kwargs).all().iterator()

    @login_required
    def resolve_client(parent, info, **kwargs):
        return parent.clients.get(**kwargs)

class TelephoneInput(graphene.InputObjectType):
    telephone = graphene.String(required=True)

class ClientInput(graphene.InputObjectType):
    index = graphene.Int()
    lab = graphene.ID(required=True)
    name = graphene.String(required=True)
    telephones = graphene.List(graphene.String, required=True)
    address = graphene.String()
    email = graphene.String()
    stage_funnel = graphene.ID()
    discount = graphene.Float()

class ClientMutation(graphene.Mutation):
    client = graphene.Field(ClientType)

    @staticmethod
    @login_required
    def mutate(root, info, input):
        telephones = []
        client = None
        if 'telephones' in input:
            telephones = input.pop('telephones')
        if 'index' in input and input['index'] != None:
            client = models.Client.objects.get(
                lab=input.pop('lab'),
                index=input.pop('index'),
            )
            if telephones != []:
                tels = []
                client.telephones.all().delete()
                for tel in telephones:
                    tels.append(
                        models.Telephone(telephone=tel, client=client, index=0)
                    )
                client.telephones.bulk_create(tels)
            models.Client.objects.filter(
                id=client.id,
            ).update(**input)
            client = models.Client.objects.get(id=client.id)
        else:
            client = models.Client(**input)
            client.save()
            if telephones != []:
                tels = []
                for tel in telephones:
                    tels.append(
                        models.Telephone(
                            telephone=tel,
                            client=client,
                        )
                    )
                result = models.Telephone.objects.bulk_create(tels)
        return ClientMutation(client=client)

    class Arguments:
        input = ClientInput(required=True)

class ClientDeletionInput(graphene.InputObjectType):
    index = graphene.Int(required=True)
    lab = graphene.Int(required=True)

class ClientDeletion(graphene.Mutation):
    ok = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        deleted = models.Client.objects.filter(**input).delete()
        return ClientDeletion(ok=deleted)

    class Arguments:
        input = ClientDeletionInput(required=True)

class Mutation:
    upsert_client = ClientMutation.Field()
    delete_client = ClientDeletion.Field()