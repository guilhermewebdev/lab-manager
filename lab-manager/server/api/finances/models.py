from django.db import models
from jobs import models as jobs
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _

class IncomingPayment(models.Model):
    objects = models.Manager()

    registration_date = models.DateTimeField(
        auto_now=True,
    )
    job = models.ForeignKey(
        jobs.Job,
        related_name='payments',
        on_delete=models.CASCADE,
    )
    payment_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Data do recebimento'),
    )
    value = models.IntegerField(
        verbose_name=('Valor recebido')
    )
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.DO_NOTHING,
        related_name='incoming_payments',
    )
    index = models.IntegerField(
        verbose_name=_('Índice'),
        blank=True,
    )

    def __str__(self):
        return f"{self.job}: R${self.value}"

    class Meta:
        verbose_name = _('Faturamento')
        verbose_name_plural = _('Faturamento')

