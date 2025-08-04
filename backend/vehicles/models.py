from django.db import models

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('car', 'Car'),
        ('suv', 'SUV'),
        ('van', 'Van'),
        ('bus', 'Bus'),
        ('luxury', 'Luxury Vehicle'),
    ]

    PACKAGE_TYPES = [
        ('1day', '1 Day Trip'),
        ('3days', '3 Days Trip'),
        ('5days', '5 Days Trip'),
        ('custom', 'Custom Trip'),
    ]

    name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES, default='custom')
    image = models.ImageField(upload_to='vehicles/', null=True, blank=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    capacity = models.IntegerField(default=4)
    is_available = models.BooleanField(default=True)
    package_details = models.TextField(blank=True, help_text="Details about the travel package")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.get_vehicle_type_display()} ({self.capacity}p)"

    def get_capacity_display(self):
        return f"{self.capacity}p"

    class Meta:
        ordering = ['name'] 