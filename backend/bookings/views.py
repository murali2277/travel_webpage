from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer, DirectBookingSerializer

class BookingCreateView(APIView):
    def post(self, request):
        """Create a new booking (legacy endpoint)"""
        serializer = BookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            # Return the full booking details
            full_serializer = BookingSerializer(booking)
            return Response(full_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingDetailView(APIView):
    def get(self, request, booking_id):
        """Get booking details by ID"""
        try:
            booking = Booking.objects.get(id=booking_id)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class DirectBookingView(APIView):
    def post(self, request):
        """Create a direct booking and send notifications via email and WhatsApp"""
        print(f"Received data: {request.data}")  # Debug print
        serializer = DirectBookingSerializer(data=request.data)
        if serializer.is_valid():
            booking_data = serializer.validated_data
            print(f"Validated data: {booking_data}")  # Debug print
            
            try:
                # Create a booking record (without specific vehicle)
                booking = Booking.objects.create(
                    customer_name=booking_data['customer_name'],
                    customer_email=booking_data['customer_email'],
                    customer_phone=booking_data['customer_phone'],
                    from_location=booking_data['from_location'],
                    to_location=booking_data['to_location'],
                    start_date=booking_data['start_date'],
                    end_date=booking_data['end_date'],
                    # Set a default vehicle or leave as null for now
                    vehicle=None,
                    total_price=0,  # Will be calculated when vehicle is assigned
                    status='pending'
                )
                print(f"Booking created with ID: {booking.id}")  # Debug print
                
                return Response({
                    'message': 'Booking request submitted successfully! We will contact you soon.',
                    'booking_id': booking.id,
                    'status': 'pending'
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                print(f"Error creating booking: {str(e)}")  # Debug print
                return Response({
                    'error': 'Failed to create booking. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Serializer errors: {serializer.errors}")  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
