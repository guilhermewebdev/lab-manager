from django.utils.translation import gettext as _
from django.db import models
from django.contrib.auth.models import Group
from labs.models import Laboratory
from django.core.exceptions import ValidationError

def validate_discount(value):
    if value > 100 or value < 0:
        raise ValidationError(
        _('Porcentagem inváilda')
    )

class BaseFunnel(models.Model):
    objects = models.Manager()
    title = models.CharField(
        _('Título'),
        max_length=100
    )
    description = models.TextField(
        verbose_name=_('Descrição'),
        max_length=400,
        null=True,
        blank=True
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )

class State(BaseFunnel):
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        null=True,
        related_name='states'
    )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        queryset = State.objects.filter(lab=self.lab).latest('index').order_by('index').reverse()
        if queryset: self.index = queryset[0].index + 1
        else: self.index = 0
        return super(State, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        ordering = ['index']
        verbose_name = _('Estado')
        verbose_name_plural = _('Estados')

class Funnel(BaseFunnel):
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        null=True,
        related_name='funnels'
    )

    def __str__(self):
        return _('Funil do %s' % (self.lab))
    
    def save(self, *args, **kwargs):
        queryset = Funnel.objects.filter(lab=self.lab).order_by('index').reverse()
        if queryset: self.index = queryset[0].index + 1
        else: self.index = 0
        return super(Funnel, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        ordering = ['index']
        verbose_name = _('Funil')
        verbose_name_plural = _('Funis')

class Stage(models.Model):
    objects = models.Manager()
    state = models.ForeignKey(
        State,
        on_delete=models.CASCADE,
        related_name='stages'
    )
    funnel = models.ForeignKey(
        Funnel,
        on_delete=models.CASCADE,
        related_name='stages'
    )
    index = models.IntegerField(
        verbose_name=_('Indexação')
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )

    class Meta:
        unique_together = ('funnel', 'index')
        ordering = ['index']
        verbose_name = _('Estágio')
        verbose_name_plural = _('Estágios')

    def __str__(self):
        return '%d: %s' % (self.index, self.state.title)

class Client(models.Model):
    objects = models.Manager()
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        related_name='clients'
    )
    name = models.CharField(
        verbose_name=_('Nome'),
        max_length=100
    )
    address = models.TextField(
        verbose_name=_('Endereço'),
        max_length=200,
    )
    email = models.EmailField(
        verbose_name=_("E-mail"),
        max_length=200,
    )
    stage_funnel = models.ForeignKey(
        Stage,
        on_delete=models.SET_NULL,
        null=True,
        related_name='clients'
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    ) 
    discount = models.FloatField(
        verbose_name=_('Desconto'),
        default=0,
        validators=[
            validate_discount
        ]
    )
    
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        queryset = Client.objects.filter(lab=self.lab).order_by('index').reverse()
        if queryset: self.index = queryset[0].index + 1
        else: self.index = 0
        return super(Client, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        ordering = ['index']
        verbose_name = _('Cliente')
        verbose_name_plural = _('Clientes')

class Patient(models.Model):
    objects = models.Manager()
    name = models.CharField(
        verbose_name=_('nome'),
        max_length=100
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='patients',
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )
    index = models.IntegerField(
        verbose_name=_('Índice'),
        blank=True,
        editable=False,
    )

    def __str__(self):
        return self.name

    def get_default_discount(self):
        return self.client.discount

    def save(self, *args, **kwargs):
        queryset = Patient.objects.filter(client=self.client).order_by('index').reverse()
        if queryset: self.index = queryset[0].index + 1
        else: self.index = 0
        return super(Patient, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'client')
        ordering = ['name']
        verbose_name = _('Paciente')
        verbose_name_plural = _('Pacientes')

class Telephone(models.Model):
    objects = models.Manager()
    telephone = models.CharField(
        max_length=20,
        verbose_name=_('Telefone ou celular'),
        unique=True
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='telephones'
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )
    index = models.IntegerField(
        verbose_name=_('Índice'),
        blank=True,
        editable=False,
    )

    def __str__(self):
        return self.telephone

    def save(self, *args, **kwargs):
        queryset = Telephone.objects.filter(client=self.client).order_by('index').reverse()
        if queryset: self.index = queryset[0].index + 1
        else: self.index = 0
        return super(Telephone, self).save(self, *args, **kwargs)

    class Meta:
        unique_together = ('telephone', 'client')
        ordering = ['index']
        verbose_name_plural = _('Telefones')
        verbose_name = _('Telefone')
