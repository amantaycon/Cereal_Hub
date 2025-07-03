from django.urls import path
from cart import views

urlpatterns = [
    path('add/', views.cart_add, name='Cart Add'),
    path('getall/', views.get_cart, name='Get Cart'),
    path('remove/', views.cart_remove, name='Cart Remove'),
]