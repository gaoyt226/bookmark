from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.user_view),
    url(r'^/info$', views.info_view),
    url(r'^/login$', views.login_view),
]