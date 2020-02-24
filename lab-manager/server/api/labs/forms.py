from django import forms
from . import models
from django.contrib.auth.models import Permission

class LaboratoryForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        required=True
    )

class ProfessionalForm(forms.Form):
    full_name = forms.CharField(
        max_length=100,
        min_length=2,
        required=True,
    )
    username = forms.CharField(
        max_length=100,
        required=True,
    )
    email = forms.EmailField()    
    
class ProfessionalUpdateForm(ProfessionalForm):
    roles = forms.ModelMultipleChoiceField(
        queryset=models.Role.objects.all(),
    )

class RegistrationForm(ProfessionalForm):    
    password = forms.CharField(
        max_length=200,
        required=True,
    )
    lab = forms.CharField(
        max_length=100,
        required=True
    )

class RoleForm(forms.Form):
    id = forms.IntegerField(
        required=False,
    )
    lab = forms.IntegerField()
    name = forms.CharField(
        max_length=100,
        required=True,
    )
    permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.all(),
        required=False,
    )

class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=200,
        required=True,
    )
    password = forms.CharField(
        max_length=200,
        required=True,
    )