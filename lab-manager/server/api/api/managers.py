from django.db.models import Manager, QuerySet


class UpsertQuerySet(QuerySet):

    def __init__(self, identifiers: list, model=None, query=None, using=None, hints=None):
        super().__init__(model=model, query=query, using=using, hints=hints)
        self.identifiers: list = identifiers

    def upsert(self, **kwargs):
        obj = None
        created = False
        if list(set(dir(self.identifiers)).intersection(dir(kwargs))) == list(self.identifiers):
            obj = self.get(
                **dict(filter(lambda a: a[0] in set(self.identifiers), kwargs.items())))
            map(lambda item: setattr(
                obj, name=item[0], value=item[1]), kwargs.items())
        else:
            obj = self.create(**kwargs)
            created = True
        obj.save()
        return (created, obj)


class UpsertManager(Manager):

    def __init__(self, identifiers: list, bytes_or_buffer, encoding=None, errors=None):
        super().__init__(bytes_or_buffer, encoding=encoding, errors=errors)
        self.identifiers: list = identifiers

    def get_queryset(self):
        return UpsertQuerySet(self.identifiers, self.model, using=self._db)

    def upsert(self, *args, **kwargs):
        return self.get_queryset().upsert(*args, **kwargs)
