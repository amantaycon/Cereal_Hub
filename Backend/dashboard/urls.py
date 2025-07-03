from django.urls import path
from dashboard import views

urlpatterns = [
    path('list/all/', views.get_all_products, name='GetAllProducts'),
    path('add/new/', views.add_new_product, name='AddNewProduct'),
    path('<int:id>/', views.product, name='product'),
]
