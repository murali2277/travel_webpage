from rest_framework import serializers
from .models import Booking
from vehicles.serializers import VehicleSerializer

class BookingSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'from_location', 'to_location', 'start_date', 'end_date',
            'vehicle', 'vehicle_details', 'total_price', 'status', 
            'status_display', 'created_at'
        ]
        read_only_fields = ['id', 'total_price', 'status', 'created_at']

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'from_location', 'to_location', 'start_date', 'end_date',
            'vehicle'
        ]
    
    def validate(self, data):
        # Check if vehicle is available for the selected dates
        start_date = data['start_date']
        end_date = data['end_date']
        vehicle = data['vehicle']
        
        if start_date >= end_date:
            raise serializers.ValidationError("End date must be after start date")
        
        # Check for conflicting bookings
        conflicting_bookings = Booking.objects.filter(
            vehicle=vehicle,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['pending', 'confirmed']
        )
        
        if conflicting_bookings.exists():
            raise serializers.ValidationError("Vehicle is not available for the selected dates")
        
        return data 