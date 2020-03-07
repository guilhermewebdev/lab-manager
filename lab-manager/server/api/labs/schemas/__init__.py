import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.contrib.auth import authenticate, login
from django.utils.translation import gettext as _
from .roles import RoleType, RoleMutation, DeleteRoleMutation
from .professional import ProfessionalType, ProfessionalMutation
from .laboratory import LaboratoryType, LaboratoryMutation
from .registration import RegisterMutation, LoginMutation

class Query(object):
    laboratories = graphene.List(
        LaboratoryType,
        lab=graphene.Int()
    )
    laboratory = graphene.Field(
        LaboratoryType,
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
    upsert_role = RoleMutation.Field()
    delete_role = DeleteRoleMutation.Field()

class PublicMutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()