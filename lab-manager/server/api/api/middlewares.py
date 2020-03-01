def remove_server_header(get_response):
    def middleware(request):
        response = get_response(request)
        print(response.has_header('Server'))
        del response['Server']
        return response
    return middleware

def set_laboratory(next, root, info, **args):
    if 'lab' in args:
        labs = list(info.context.user.labs.all())
        lab = labs[max(min(args.pop('lab'), len(labs)), 0)]
        args.update({'lab':lab})
    return next(root, info, **args)