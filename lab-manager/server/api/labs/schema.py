import graphene 
from graphene_django import types
from . import models

class LaboratoryType(types.DjangoObjectType):

    class Meta:
        model = models.Laboratory
        fields = (
            'id',
            'name',
            'permissions',
            'registration_date',
        )

class ProfessionalType(types.DjangoObjectType):

    class Meta:
        model = models.Professional

class RoleType(types.DjangoObjectType):

    class Meta:
        model = models.Role

class Query(object):
    laboratories = graphene.List(LaboratoryType)
    laboratory = graphene.Field(
        LaboratoryType,
        index=graphene.Int()
    )
    professionals = graphene.List(ProfessionalType)
    roles = graphene.List(RoleType)

    def resolve_laboratories(self, info, **kwargs):
        if info.context.user.is_authenticated():
            return info.context.user.labs.filter(**kwargs).all()
        else:
            return models.Laboratory.objects.none()

    def resolve_laboratory(self, info, **kwargs):
        if info.context.user.is_authenticated():
            index = kwargs.pop('index')
            labs = list(info.context.user.labs.filter(**kwargs).all())
            return labs[max(min(kwargs[index], len(labs)), 0)]                
        else:
            return models.Laboratory.objects.get()

    def resolve_professionals(self, info, **kwargs):
        return models.Professional.objects.filter(**kwargs).all()

    def resolve_roles(self, info, **kwargs):
        return models.Role.objects.filter(**kwargs).all()