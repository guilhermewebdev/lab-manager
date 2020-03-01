import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from . import models, forms
from django.contrib.auth import authenticate, login
from django.utils.translation import gettext as _

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
            'registration_date',
        )        

class RoleMutation(mutation.DjangoFormMutation):
    role = graphene.Field(RoleType)

    @classmethod
    def perform_mutate(cls, form, info):
        permissions = []
        role = None
        lab = get_lab(info.context.user.labs, form.cleaned_data.pop('lab'))
        if 'permissions' in form.cleaned_data:
            permissions = form.cleaned_data.pop('permissions')
        if 'id' in form.cleaned_data:
            role = models.Role.objects.filter(
                id=form.cleaned_data.pop('id'),
                lab=lab
            ).update(**form.cleaned_data)
        else: role = models.Role(
                **form.cleaned_data,
                lab=lab,
            )
        role.save()
        if permissions != []:
            role.permissions.clear()
            role.permissions.add(*permissions)
        return RoleMutation(role=role)

    class Meta:
        form_class = forms.RoleForm

class DeleteRoleMutation(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        obj = models.Role.objects.get(pk=kwargs['id'])
        return cls(ok=obj.delete())


class LaboratoryType(types.DjangoObjectType):
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
    upsert_role = RoleMutation.Field()
    delete_role = DeleteRoleMutation.Field()

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
        print(form.cleaned_data)
        user = authenticate(
            info.context,
            username=form.cleaned_data.pop('username'),
            password=form.cleaned_data.pop('password'),
        )
        if user is not None:
            login(info.context, user, 'axes.backends.AxesBackend')
            return LoginMutation(professional=user)
        else: return LoginMutation(errors=[_('Crendenciais incorretas')])

    class Meta:
        form_class = forms.LoginForm

class PublicMutation(graphene.ObjectType):
    register = RegisterMutation.Field()
    login = LoginMutation.Field()