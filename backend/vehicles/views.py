from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime
from .models import Vehicle
from .serializers import VehicleSerializer, SearchRequestSerializer
from bookings.models import Booking # Import Booking model for availability check

class VehicleListView(APIView):
    def get(self, request):
        """Get all available vehicles"""
        vehicles = Vehicle.objects.filter(is_available=True)
        serializer = VehicleSerializer(vehicles, many=True, context={'request': request})
        return Response(serializer.data)

class SearchView(APIView):
    def post(self, request):
        """Search for available vehicles based on location, dates, and filters"""
        serializer = SearchRequestSerializer(data=request.data)
        if serializer.is_valid():
            from_location = serializer.validated_data['from_location']
            to_location = serializer.validated_data['to_location']
            from_date = serializer.validated_data['from_date']
            to_date = serializer.validated_data['to_date']
            vehicle_type = serializer.validated_data.get('vehicle_type')
            passengers = serializer.validated_data.get('passengers')

            # Get all available vehicles
            available_vehicles = Vehicle.objects.filter(is_available=True)

            # Apply filters
            if vehicle_type:
                available_vehicles = available_vehicles.filter(vehicle_type=vehicle_type)
            
            if passengers:
                available_vehicles = available_vehicles.filter(capacity__gte=passengers)

            # Filter out vehicles that are already booked for the requested dates
            conflicting_bookings = Booking.objects.filter(
                start_date__lte=to_date,
                end_date__gte=from_date
            )
            booked_vehicle_ids = conflicting_bookings.values_list('vehicle_id', flat=True)
            available_vehicles = available_vehicles.exclude(id__in=booked_vehicle_ids)

            # Serialize the results
            vehicle_serializer = VehicleSerializer(
                available_vehicles,
                many=True,
                context={'request': request}
            )

            return Response({
                'vehicles': vehicle_serializer.data,
                'search_criteria': {
                    'from_location': from_location,
                    'to_location': to_location,
                    'from_date': from_date,
                    'to_date': to_date,
                    'vehicle_type': vehicle_type,
                    'passengers': passengers,
                }
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 