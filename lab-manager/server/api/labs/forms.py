from django import forms
from . import models

class LaboratoryForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        required=True
    )

class ProfessionalForm(forms.Form):
    username = forms.CharField(
        max_length=100,
        required=True,
    )
    email = forms.EmailField()
    full_name = forms.CharField(
        max_length=100,
        min_length=2,
        required=True,
    )
    roles = forms.ModelMultipleChoiceField(
        queryset=models.Role.objects.all()
    )    

class RegistrationForm(LaboratoryForm, ProfessionalForm):
    password = forms.PasswordInput()
    roles = None