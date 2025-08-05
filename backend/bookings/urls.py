from django.urls import path
from .views import BookingCreateView, BookingDetailView, DirectBookingView

urlpatterns = [
    path('book/', BookingCreateView.as_view(), name='booking-create'),
    path('booking/<int:booking_id>/', BookingDetailView.as_view(), name='booking-detail'),
    path('direct-book/', DirectBookingView.as_view(), name='direct-booking'),
] 