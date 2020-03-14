import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.contrib.auth import authenticate, login
from django.utils.translation import gettext as _
from . import registration, laboratory, role, professional

class Query(object):
    laboratories = graphene.List(
        laboratory.LaboratoryType,
        lab=graphene.Int()
    )
    laboratory = graphene.Field(
        laboratory.LaboratoryType,
        lab=graphene.Int()
    )

    def resolve_laboratories(self, info, **kwargs):
        if info.context.user.is_authenticated:
            if 'lab' in kwargs:
                return self.resolve_laboratory(info, **kwargs)
            return info.context.user.labs.filter(**kwargs).all()
        else:
            return models.Laboratory.objects.none()

    def resolve_laboratory(self, info, **kwargs):
        if info.context.user.is_authenticated:
            lab = kwargs.pop('lab')
            return get_lab(info.context.user.labs.filter(**kwargs), lab)                
        else:
            return models.Laboratory.objects.get()    

# Mutations
class Mutation(graphene.ObjectType):
    upsert_role = role.RoleMutation.Field()
    delete_role = role.DeleteRoleMutation.Field()
    upsert_professional = professional.ProfessionalMutation.Field()

class PublicMutation(graphene.ObjectType):
    register = registration.RegisterMutation.Field()
    login = registration.LoginMutation.Field()
    logout = registration.LogOutMutation.Field()

class PublicQuery(graphene.ObjectType):
    is_authenticated = graphene.Boolean()

    def resolve_is_authenticated(self, info):
        return info.context.user.is_authenticated