import graphene 
from graphene_django import types
from graphene_django.forms import mutation
from labs import models, forms, get_lab
from django.utils.translation import gettext as _

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
        print(form.cleaned_data)
        permissions = []
        role = None
        lab = get_lab(info.context.user.labs, form.cleaned_data.pop('lab'))
        if 'permissions' in form.cleaned_data:
            permissions = form.cleaned_data.pop('permissions')        
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