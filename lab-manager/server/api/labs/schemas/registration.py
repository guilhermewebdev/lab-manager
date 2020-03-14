import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext as _
from .role import RoleType
from .professional import ProfessionalType
from .laboratory import LaboratoryType

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

class LogOutMutation(graphene.Mutation):
    ok = graphene.Boolean()
    
    @staticmethod
    def mutate(root, info):
        return LogOutMutation(
            ok=logout(info.context)
        )
