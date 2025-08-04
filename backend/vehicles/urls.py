from django.urls import path
from .views import VehicleListView, SearchView

urlpatterns = [
    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('search/', SearchView.as_view(), name='search'),
] 