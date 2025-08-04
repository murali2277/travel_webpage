from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['name', 'vehicle_type', 'package_type', 'price_per_day', 'capacity', 'is_available', 'created_at']
    list_filter = ['vehicle_type', 'package_type', 'is_available', 'created_at']
    search_fields = ['name', 'description', 'package_details']
    list_editable = ['is_available', 'price_per_day']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'vehicle_type', 'package_type', 'description')
        }),
        ('Pricing & Availability', {
            'fields': ('price_per_day', 'is_available', 'capacity')
        }),
        ('Package Details', {
            'fields': ('package_details',)
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 