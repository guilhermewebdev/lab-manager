from django.utils.translation import gettext as _
from django.db import models
from crm.models import Client, Patient, validate_discount
from django.contrib.auth.models import Group

class BaseJob(models.Model):
    objects = models.Manager()
    name = models.CharField(
        verbose_name=_('Trabalho'),
        max_length=200
    )
    description = models.TextField(
        verbose_name=_("Descrição"),
        max_length=300,
        null=True,
        blank=True
    )
    price = models.FloatField(
        verbose_name=_('Preço')
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )

    def __str__(self):
        return self.name

    class Meta:
        required_db_vendor = 'postgresql'

class Procedure(BaseJob):
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='procedures',
    )

    def save(self, *args, **kwargs):
        if not self.id:
            queryset = Procedure.objects.filter(lab=self.lab).order_by('index').reverse()
            if queryset: self.index = queryset[0].index + 1
            else: self.index = 0
        return super(Procedure, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        verbose_name = _('Procedimento')
        verbose_name_plural = _('Procedimentos')
        ordering = ('-registration_date', 'lab')

class Stage(models.Model):
    objects = models.Manager()

    procedure = models.ForeignKey(
        Procedure,
        on_delete=models.CASCADE,
        related_name='stages'
    )
    index = models.IntegerField(
        verbose_name=_('Índice'),
        blank=True,
    )
    price = models.FloatField(
        verbose_name=_('Preço')
    )
    process = models.ForeignKey(
        'Process',
        on_delete=models.CASCADE,
        null=True,
        related_name='stages'
    )
    registration_date = models.DateField(
        auto_now=True,
        verbose_name=_("Data de cadastro"),
    )

    def get_default_price(self):
        return self.procedure.price

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.get_default_price()
        return super(Stage, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('process', 'index')
        ordering = ['index', 'process']

class Process(BaseJob):
    is_custom = models.BooleanField(
        verbose_name=_('É customizado?'),
        default=False
    )
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='processes'
    )

    def get_stages(self):
        return self.stages.all()

    def get_default_price(self):
        return self.stages.all().aggregate(models.Sum('price'))['price__sum'] or 0

    def set_default_price(self):
        self.price = self.get_default_price()

    def save(self, *args, **kwargs):
        if not self.price:
            self.set_default_price()
        if not self.id:
            queryset = list(Process.objects.filter(
                lab=self.lab
            ).order_by('index').reverse())
            if queryset: self.index = queryset[0].index + 1
            else: self.index = 0
        return super(Process, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        verbose_name = _('Processo')
        verbose_name_plural = _('Processos')
        ordering = ('-registration_date', 'lab')

class Job(BaseJob):
    kind = models.ForeignKey(
        Process,
        on_delete=models.SET_NULL,
        related_name='kind',
        null=True   
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.DO_NOTHING,
        related_name='jobs'
    )
    arrival = models.DateTimeField(
        editable=True,
        verbose_name=_('Data da chegada'),
        auto_now_add=True
    )    
    started = models.DateTimeField(
        verbose_name=_('Data de início'),
        null=True,
        blank=True
    )
    finished = models.DateTimeField(
        verbose_name=_('Data da finalização'),
        null=True,
        blank=True
    )
    delivered = models.DateField(
        verbose_name=_('Data da entrega'),
        null=True,
        blank=True,
    )
    deadline = models.DateTimeField(
        verbose_name=_('Prazo de entrega'),
    )
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    
    def get_discount(self):
        if self.discount:
            return self.discount
        else:
            return self.get_default_discount()

    def get_default_discount(self):
        return self.patient.client.discount

    def get_default_price(self):
        return self.kind.price * ((100 - self.get_default_discount()) / 100)

    def get_price(self):
        if self.price:
            return self.price
        else:
            return self.get_default_price()

    def save(self, *args, **kwargs):
        self.price = self.get_price()
        if not self.id:
            queryset = Job.objects.filter(
                patient=self.patient,
            ).order_by('index').reverse()
            if queryset: self.index = queryset[0].index + 1
            else: self.index = 0
        return super(Job, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _('Trabalho')
        verbose_name_plural = _('Trabalho')
        unique_together = ('index', 'patient')
        ordering = ('-registration_date', 'patient')
