from django.urls import path
from .views import BookingCreateView, BookingDetailView

urlpatterns = [
    path('book/', BookingCreateView.as_view(), name='booking-create'),
    path('booking/<int:booking_id>/', BookingDetailView.as_view(), name='booking-detail'),
] 