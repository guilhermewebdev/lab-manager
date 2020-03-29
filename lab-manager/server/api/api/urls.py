"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from labs.views import PrivateGraphQLView
from api.schema import public_schema, schema
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', csrf_exempt(PrivateGraphQLView.as_view(graphiql=True, schema=schema))),
    path('api/public/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=public_schema))),
    path('api/oauth/', csrf_exempt(include('oauth2_provider.urls', namespace='oauth2_provider'))),
]
