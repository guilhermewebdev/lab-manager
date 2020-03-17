import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.contrib.auth import authenticate, login
from django.utils.translation import gettext as _
from .role import RoleType
from .professional import ProfessionalType
from crm import schemas as crm
from jobs import schemas as jobs

class LaboratoryType(
    types.DjangoObjectType,
    crm.Query,
    jobs.Query
):
    roles = graphene.List(RoleType)
    role = graphene.Field(
        RoleType,
        id=graphene.ID(required=True)
    )
    professionals = graphene.List(ProfessionalType)

    def resolve_professionals(parent, info, **kwargs):
        return parent.professionals.filter(**kwargs).all()

    def resolve_role(parent, info, **kwargs):
        return parent.roles.get(**kwargs)
    
    def resolve_roles(parent, info, **kwargs):
        return parent.roles.filter(**kwargs).all()

    class Meta:
        model = models.Laboratory
        fields = (
            'id',
            'name',
            'roles',
            'professionals',
            'registration_date',
        )

class LaboratoryMutation(mutation.DjangoFormMutation):
    laboratory = graphene.Field(LaboratoryType)

    @classmethod
    def perform_mutate(cls, form, info):
        lab = models.Laboratory(**form.cleaned_data)
        lab.save()
        info.context.user.labs.add(lab)
        return LaboratoryMutation(laboratory=lab)

    class Meta:
        form_class = forms.LaboratoryForm