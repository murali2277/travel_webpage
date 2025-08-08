from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer_name', 'customer_email', 'from_location', 
        'to_location', 'start_date', 'end_date', 'total_price', 
        'status', 'created_at'
    ]
    actions = ['delete_all_bookings']
    list_filter = [
        'status', 'start_date', 'end_date', 'created_at'
    ]
    search_fields = [
        'customer_name', 'customer_email', 'from_location', 'to_location'
    ]
    readonly_fields = ['created_at', 'updated_at', 'total_price']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Trip Details', {
            'fields': (
                'from_location', 'to_location', 'start_date', 'end_date'
            )
        }),
        ('Vehicle & Pricing', {
            'fields': ('vehicle', 'total_price')
        }),
        ('Booking Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def delete_all_bookings(self, request, queryset):
        queryset.delete()
        self.message_user(
            request, "All selected bookings have been deleted successfully."
        )
    delete_all_bookings.short_description = "Delete all selected bookings"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('vehicle')
