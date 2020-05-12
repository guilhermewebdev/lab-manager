import graphene
from graphql import GraphQLError
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext as _
from .role import RoleType
from .professional import ProfessionalType
from .laboratory import LaboratoryType
from django.db.models import Q

# Registration
class RegistrationInput(graphene.InputObjectType):
    full_name = graphene.String(required=True)
    username = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    laboratory = graphene.String(required=True)

class RegisterMutation(graphene.Mutation):
    professional = graphene.Field(ProfessionalType)
    laboratory = graphene.Field(LaboratoryType)

    def mutate(root, info, input):
        user_exists = models.Professional.objects.filter(
            Q(username=input['username']) |
            Q(email=input['email']) |
            Q(labs__name__in=[input['laboratory']])
        ).exists()
        if(not user_exists):
            lab = models.Laboratory.objects.create(name=input.pop('laboratory'))        
            lab.save()
            professional = models.Professional.objects.create_user(
                **input
            )
            professional.save()
            professional.labs.add(lab)
            return RegisterMutation(
                professional=professional,
                laboratory=lab
            )
        else:
            raise GraphQLError(_("Usuário ou laboratório já existe"))

    class Arguments:
        input = RegistrationInput(required=True)

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
        logout(info.context)
        return LogOutMutation(
            ok=(not info.context.user.is_authenticated)
        )
