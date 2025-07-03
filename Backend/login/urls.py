from django.urls import path
from login import views

urlpatterns = [
    path('register/', views.register_user, name='Ragistration'),
    path('login/', views.login_user, name='Login'),
    path('logout/', views.logout_user, name='Logout'),
    path('csrf/', views.get_csrf, name='GetCSRFToken'),
]