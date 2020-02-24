import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from . import models, forms
from django.contrib.auth import authenticate, login

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
            'registration_date',
        )

class Query(object):
    laboratories = graphene.List(
        LaboratoryType,
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

class Mutation(graphene.ObjectType):
    create_role = RoleMutation.Field()

# Registration
class RegisterMutation(mutation.DjangoFormMutation):
    professional = graphene.Field(ProfessionalType)
    laboratory = graphene.Field(LaboratoryType)

    @classmethod
    def perform_mutate(cls, form, info):
        lab = models.Laboratory(name=form.cleaned_data.pop('lab'))        
        lab.save()
        professional = models.Professional.objects.create_user(
            **form.cleaned_data
        )
        professional.save()
        professional.labs.add(lab)
        professional.save()
        return RegisterMutation(
            professional=professional,
            laboratory=lab
        )

    class Meta:
        form_class = forms.RegistrationForm

class LoginMutation(mutation.DjangoFormMutation):
    professional = graphene.Field(ProfessionalType)

    @classmethod
    def perform_mutate(cls, form, info):
        user = authenticate(
            info.context,
            username=form.cleaned_data.pop('username'),
            password=form.cleaned_data.pop('password'),
        )
        if user is not None:
            login(info.context, user, 'axes.backends.AxesBackend')
            return LoginMutation(professional=user)
        else: return LoginMutation()

    class Meta:
        form_class = forms.LoginForm

class PublicMutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()