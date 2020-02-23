from django.db import models
from django.contrib.auth.models import Group, GroupManager, AbstractUser
from django.utils.translation import gettext as _

class Laboratory(Group):
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['registration_date']
        verbose_name = _('Laboratório')
        verbose_name_plural = _('Laboratórios')


class Role(Group):
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        related_name='roles',
        null=True,
        blank=True,        
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Cargo')
        verbose_name_plural = _('Cargos')

class Professional(AbstractUser):
    groups = None
    labs = models.ManyToManyField(
        Laboratory,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The labs this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="professionals",
        related_query_name="professional",
    )
    full_name = models.CharField(
        _('full name'),
        max_length=200,
        blank=False,
        null=False
    )
    roles = models.ManyToManyField(
        Role,
        related_name='professionals',
    )
    email = models.EmailField(
        _('Endereço de email'),
        blank=True,
        unique=True,
    )
    
    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'
        abstract = False
        verbose_name = _('Profissional')
        verbose_name_plural = _('Profissionais')

