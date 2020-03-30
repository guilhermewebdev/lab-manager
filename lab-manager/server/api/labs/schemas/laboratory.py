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
from graphql_jwt.decorators import login_required

class LaboratoryType(
    types.DjangoObjectType,
    crm.Query,
    jobs.Query
):
    index = graphene.Int(required=True)
    roles = graphene.List(RoleType)
    role = graphene.Field(
        RoleType,
        id=graphene.ID(required=True)
    )
    professionals = graphene.List(ProfessionalType)
    professional = graphene.Field(
        ProfessionalType,
        id=graphene.ID(required=True)
    )
    me = graphene.Field(ProfessionalType)

    @login_required
    def resolve_index(parent, info):
        return int(list(info.context.user.labs.all().iterator()).index(parent))

    @login_required
    def resolve_professionals(parent, info, **kwargs):
        return parent.professionals.filter(**kwargs).all()

    @login_required
    def resolve_professional(parent, info, **kwargs):
        return parent.professional.get(**kwargs)

    @login_required
    def resolve_me(parent, info, **kwargs):
        return info.context.user

    @login_required
    def resolve_role(parent, info, **kwargs):
        return parent.roles.get(**kwargs)
    
    @login_required
    def resolve_roles(parent, info, **kwargs):
        return parent.roles.filter(**kwargs).all()

    class Meta:
        model = models.Laboratory
        fields = (
            'id',
            'index',
            'name',
            'roles',
            'professionals',
            'registration_date',
        )

class LaboratoryMutation(mutation.DjangoFormMutation):
    laboratory = graphene.Field(LaboratoryType)

    @classmethod
    @login_required
    def perform_mutate(cls, form, info):
        lab = models.Laboratory(**form.cleaned_data)
        lab.save()
        info.context.user.labs.add(lab)
        return LaboratoryMutation(laboratory=lab)

    class Meta:
        form_class = forms.LaboratoryForm

class UpdateInput(graphene.InputObjectType):
    lab = graphene.Int(required=True)
    name = graphene.String(required=True)

class UpdateMutation(graphene.Mutation):
    laboratory = graphene.Field(LaboratoryType)

    @staticmethod
    @login_required
    def mutate(root, info, input):
        lab = input.pop('lab')
        for key, value in input.values():
            setattr(lab, key, value)
        lab.save(update_fields=input.keys())
        return UpdateMutation(
            laboratory=lab
        )

    class Arguments:
        input = UpdateInput(required=True)