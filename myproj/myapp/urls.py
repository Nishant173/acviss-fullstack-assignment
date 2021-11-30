from django.urls import path
from . import views

urlpatterns = [
    path(route='token-auth/', view=views.AuthView.as_view(), name='token-auth'),
    path(route='codes/', view=views.codes, name='codes'),
]