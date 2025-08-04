from django.db import models
from django.conf import settings
from vehicles.models import Vehicle

class Booking(models.Model):
    BOOKING_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    # User and Customer Information
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)

    # Trip Details
    from_location = models.CharField(max_length=100)
    to_location = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    # Vehicle and Pricing
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='bookings')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Booking Status
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.customer_name} ({self.start_date} to {self.end_date})"

    def save(self, *args, **kwargs):
        # Calculate total price if not set
        if not self.total_price:
            days = (self.end_date - self.start_date).days
            self.total_price = self.vehicle.price_per_day * days
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at'] 