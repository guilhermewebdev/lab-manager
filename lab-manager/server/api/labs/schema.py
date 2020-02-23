import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from . import models, forms

def get_lab(queryset, index):
    labs = list(queryset.all())
    return labs[max(min(index, len(labs)), 0)] 


# Queries
class ProfessionalType(types.DjangoObjectType):

    class Meta:
        model = models.Professional
        fields = (
            'id', 
            'full_name',
            'username',
            'email',
            'labs',
            'roles',
        )

class RoleType(types.DjangoObjectType):

    class Meta:
        model = models.Role
        fields = (
            'id',
            'name',
            'permissions',
            'registration_date'
        )

class LaboratoryType(types.DjangoObjectType):
    roles = graphene.List(RoleType)
    professionals = graphene.List(ProfessionalType)

    def resolve_professionals(self, info, **kwargs):
        lab = get_lab(info.context.user.labs.all(), kwargs.pop('lab'))
        return models.Professional.objects.filter(
            **kwargs,
            labs__in=[lab],
        ).all()

    def resolve_roles(self, info, **kwargs):
        lab = get_lab(info.context.user.labs.all(), kwargs.pop('lab'))
        return models.Role.objects.filter(
            **kwargs,
            lab=lab,
        ).all()

    class Meta:
        model = models.Laboratory
        fields = (
            'id',
            'name',
            'roles',
            'professionals',
            'permissions',
            'registration_date',
        )

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
                lab = kwargs.pop('lab')
                return get_lab(info.context.user.labs.filter(**kwargs), lab)
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

class RoleMutation(mutation.DjangoFormMutation):
    role = graphene.Field(RoleType)

    class Meta:
        form_class = forms.RoleForm

class Mutation(graphene.ObjectType):
    create_role = RoleMutation.Field()
    update_role = RoleMutation.Field()


# Registration

class ProfessionaRegistrationlMutation(mutation.DjangoFormMutation):
    professional = graphene.Field(ProfessionalType)

    class Meta:
        form_class = forms.ProfessionalRegistrationForm

class LaboratoryMutation(mutation.DjangoFormMutation):
    laboratory = graphene.Field(LaboratoryType)

    class Meta:
        form_class = forms.LaboratoryForm

class RegistrationMutation(graphene.ObjectType):
    create_professional = ProfessionaRegistrationlMutation.Field(required=True)
    create_laboratory = LaboratoryMutation.Field(required=True)

auth_schema = graphene.Schema(mutation=RegistrationMutation)
