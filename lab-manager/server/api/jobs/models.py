from django.utils.translation import gettext as _
from django.db import models
from crm.models import Client, Patient, validate_discount
from labs.models import Laboratory
from django.core.exceptions import ValidationError


class BaseJob(models.Model):
    objects = models.Manager()
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

    class Meta:
        required_db_vendor = 'postgresql'


class Stage(models.Model):
    objects = models.Manager()

    procedure = models.ForeignKey(
        'Procedure',
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

    def __str__(self):
        return f"{self.process}: {self.procedure}"

    def get_default_price(self):
        return self.procedure.price

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.get_default_price()
        return super(Stage, self).save(*args, **kwargs)

    class Meta:
        unique_together = (
            ('process', 'index'),
        )
        ordering = ['index', 'process']


class Process(BaseJob):
    name = models.CharField(
        verbose_name=_('Nome'),
        max_length=200
    )
    is_custom = models.BooleanField(
        verbose_name=_('É customizado?'),
        default=False
    )
    need_color = models.BooleanField(
        verbose_name=_('Precisa da cor do dente'),
        null=True,
        blank=True,
    )
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        related_name='processes'
    )

    def get_default_price(self):
        return self.stages.all().aggregate(models.Sum('price'))['price__sum'] or None

    def __set_default_price(self):
        self.price = self.get_default_price()

    def __check_need_color(self):
        return self.stages.all().filter(need_color=True).exists()

    def save(self, *args, **kwargs):
        if not self.price:
            self.__set_default_price()
        if not self.id:
            queryset = list(Process.objects.filter(
                lab=self.lab
            ).order_by('index').reverse())
            if queryset:
                self.index = queryset[0].index + 1
            else:
                self.index = 0
            if self.need_color == None:
                self.need_color = self.__check_need_color()
        return super(Process, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        verbose_name = _('Processo')
        verbose_name_plural = _('Processos')
        ordering = ('-registration_date', 'lab')


class Procedure(BaseJob):
    name = models.CharField(
        verbose_name=_('Trabalho'),
        max_length=200
    )
    index = models.IntegerField(
        verbose_name=_('índice'),
        blank=True,
        editable=False,
    )
    lab = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        related_name='procedures',
    )
    need_color = models.BooleanField(
        verbose_name=_('Precisa da cor do dente'),
        null=True,
        blank=True,
    )

    def __set_stages_need_color(self):
        if self.need_color:
            stages = list(self.stages.all().iterator())
            def set_process(stage):
                process = stage.process
                process.need_color = self.need_color
                return process
            processes = list(map(set_process, stages))
            Process.objects.bulk_update(processes, ['need_color'])
            
    def save(self, *args, **kwargs):
        self.__set_stages_need_color()
        if not self.id:
            queryset = Procedure.objects.filter(
                lab=self.lab).order_by('index').reverse()
            if queryset:
                self.index = queryset[0].index + 1
            else:
                self.index = 0
        return super(Procedure, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('index', 'lab')
        verbose_name = _('Procedimento')
        verbose_name_plural = _('Procedimentos')
        ordering = ('-registration_date', 'lab')


class Job(BaseJob):
    kind = models.ForeignKey(
        Process,
        verbose_name=_('Tipo'),
        on_delete=models.SET_NULL,
        related_name='kind',
        null=True
    )
    amount = models.IntegerField(
        verbose_name=_('Quantidade'),
        default=1,
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

    def __str__(self):
        return f'{self.patient.name}: {self.amount} x {self.kind.name}'

    def get_discount(self):
        return self.get_price() - self.get_default_price()

    def get_default_discount(self):
        return self.patient.client.discount

    def get_default_price(self):
        return self.kind.price * self.amount * ((100 - self.get_default_discount()) / 100)

    def get_price(self):
        if self.price:
            return self.price
        else:
            return self.get_default_price()

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        if(self.kind.need_color and not self.patient.tooth_color):
            raise ValidationError(
                _('É preciso informar a cor dos dentes do paciente %(patient) para utilizar o processo %(process)'),
                params=dict(
                    patient=self.patient.name,
                    process=self.kind.name,
                )
            )

    def save(self, *args, **kwargs):
        self.price = self.get_price()
        self.clean_fields()
        if not self.id:
            queryset = Job.objects.filter(
                patient=self.patient,
            ).order_by('index').reverse()
            if queryset:
                self.index = queryset[0].index + 1
            else:
                self.index = 0
        return super(Job, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _('Trabalho')
        verbose_name_plural = _('Trabalhos')
        unique_together = ('index', 'patient')
        ordering = ('-registration_date', 'patient')


class Proof(models.Model):
    departure = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Saída"),
        editable=True,
    )
    arrival = models.DateTimeField(
        verbose_name=_("Retorno"),
        null=True,
        blank=True,
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='proofs'
    )
    description = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    stage = models.ForeignKey(
        Stage,
        on_delete=models.DO_NOTHING,
        related_name=_('proofs')
    )

    def __str__(self):
        return f"{self.job}: {self.stage}"

    def save(self, *args, **kwargs):
        self.clean_fields()
        if not self.id:
            queryset = Proof.objects.filter(
                job=self.job,
            ).order_by('index').reverse()
            if queryset.exists():
                self.index = queryset[0].index + 1
            else:
                self.index = 0
        return super(Proof, self).save(*args, **kwargs)

    class Meta:
        verbose_name = _('Prova')
        verbose_name_plural = _('Provas')