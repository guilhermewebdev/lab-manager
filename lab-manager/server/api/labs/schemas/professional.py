import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.utils.translation import gettext as _

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

class ProfessionalMutation(mutation.DjangoFormMutation):
    professional = graphene.Field(ProfessionalType)

    @classmethod
    def perform_mutate(cls, form, info):
        lab = get_lab(info.context.user.labs, form.cleaned_data.pop('lab'))
        user = None
        if 'id' in form.cleaned_data and 'password' not in form.cleaned_data:
            user = models.Professional.objects.update(**form.cleaned_data)
        elif 'password' in form.cleaned_data:
            user = models.Professional.objects.create_user(**form.cleaned_data)
        if user: user.labs.add(lab)
        return cls(professional=user)

    class Meta:
        form_class = forms.ProfessionalUpdateForm