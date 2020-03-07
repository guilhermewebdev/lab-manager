def get_lab(queryset, index):
    labs = list(queryset.all())
    return labs[max(min(index, len(labs)), 0)]