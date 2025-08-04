from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    vehicle_type_display = serializers.CharField(source='get_vehicle_type_display', read_only=True)
    package_type_display = serializers.CharField(source='get_package_type_display', read_only=True)
    capacity_display = serializers.CharField(source='get_capacity_display', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id', 'name', 'vehicle_type', 'vehicle_type_display',
            'package_type', 'package_type_display', 'image', 'image_url', 
            'price_per_day', 'description', 'capacity', 'capacity_display',
            'package_details', 'is_available', 'created_at'
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class SearchRequestSerializer(serializers.Serializer):
    from_location = serializers.CharField(max_length=100)
    to_location = serializers.CharField(max_length=100)
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    vehicle_type = serializers.ChoiceField(choices=Vehicle.VEHICLE_TYPES, required=False)
    passengers = serializers.IntegerField(min_value=1, required=False) 