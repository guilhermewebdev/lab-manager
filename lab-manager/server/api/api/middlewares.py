def remove_server_header(get_response):
    def middleware(request):
        response = get_response(request)
        print(response.has_header('Server'))
        del response['Server']
        return response
    return middleware

def set_laboratory(next, root, info, **args):
    print(args)
    if 'input' in args:
        if 'lab' in args['input']:
            labs = list(info.context.user.labs.all().iterator())
            args['input'].update({
                'lab': labs[max(min(int(args['input'].pop('lab')), len(labs)), 0)]
            })
            print(args)
    return next(root, info, **args)