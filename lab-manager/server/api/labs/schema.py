import graphene 
from graphene_django import types
from . import models, forms

def get_lab(queryset, index):
    labs = list(queryset.all())
    return labs[max(min(index, len(labs)), 0)] 

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

class ProfessionalMutation(graphene.Mutation):
    professional = graphene.Field(ProfessionalType)

    def mutate(self, info, **kwargs):
        lab_index = kwargs.pop('lab')
        lab = get_lab(info.context.user.labs.all(), lab_index)
        professional = models.Professional(**kwargs)
        professional.labs.add(lab)
        professional.save()
        return ProfessionalMutation(professional=professional)

    class Meta:
        form_class = forms.ProfessionalForm
        input_field_name = 'data'
        return_field_name = 'professional'

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
    roles = graphene.Field(RoleType)
    professionals = graphene.List(ProfessionalType)

    def resolve_professionals(self, info, **kwargs):
        return models.Professional.objects.filter(**kwargs).all()

    def resolve_roles(self, info, **kwargs):
        return models.Role.objects.filter(**kwargs).all()

    class Meta:
        model = models.Laboratory
        fields = (
            'id',
            'name',
            'permissions',
            'registration_date',
        )

class LaboratoryMutation(graphene.Mutation):
    laboratory = graphene.Field(LaboratoryType)

    class Meta:
        form_class = forms.LaboratoryForm
        input_field_name = 'data'
        return_field_name = 'laboratory'

    def mutate(self, info, **kwargs):
        laboratory = models.Laboratory(**kwargs)
        laboratory.save()
        info.context.user.labs.add(laboratory)
        return LaboratoryMutation(laboratory=laboratory)

class RegistrationMutation(graphene.Mutation):
    laboratory = graphene.Field(LaboratoryType)
    professional = graphene.Field(ProfessionalType)

    def mutate(self, info, **kwargs):
        lab = kwargs.pop('lab')
        laboratory = models.Laboratory(name=lab)
        laboratory.save()
        professional = models.Professional.objects.create_user(**kwargs)
        professional.labs.add(laboratory)
        return RegistrationMutation(
            professional=professional,
            laboratory=laboratory
        )

    class Meta:
        form_class = forms.RegistrationForm
        input_field_name = 'data'
        return_field_name = 'professional'

class Query(object):
    laboratories = graphene.List(
        LaboratoryType,
        index=graphene.Int()
    )
    laboratory = graphene.Field(
        LaboratoryType,
        index=graphene.Int()
    )

    def resolve_laboratories(self, info, **kwargs):
        if info.context.user.is_authenticated:
            if 'index' in kwargs:
                index = kwargs.pop('index')
                return get_lab(info.context.user.labs.filter(**kwargs), index)
            return info.context.user.labs.filter(**kwargs).all()
        else:
            return models.Laboratory.objects.none()

    def resolve_laboratory(self, info, **kwargs):
        if info.context.user.is_authenticated:
            index = kwargs.pop('index')
            return get_lab(info.context.user.labs.filter(**kwargs), index)                
        else:
            return models.Laboratory.objects.get()    