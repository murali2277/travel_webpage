from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
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
                
                # Send email notification
                self.send_booking_email(booking_data)
                
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
    
    def send_booking_email(self, booking_data):
        """Send booking confirmation email"""
        try:
            subject = f"New Booking Request - {booking_data['customer_name']}"
            
            # Create email content
            html_message = f"""
            <html>
            <body>
                <h2>New Booking Request</h2>
                <p><strong>Customer Name:</strong> {booking_data['customer_name']}</p>
                <p><strong>Email:</strong> {booking_data['customer_email']}</p>
                <p><strong>Phone:</strong> {booking_data['customer_phone']}</p>
                <p><strong>From:</strong> {booking_data['from_location']}</p>
                <p><strong>To:</strong> {booking_data['to_location']}</p>
                <p><strong>Start Date:</strong> {booking_data['start_date']}</p>
                <p><strong>End Date:</strong> {booking_data['end_date']}</p>
                <p><strong>Vehicle Type:</strong> {booking_data.get('vehicle_type', 'Not specified')}</p>
                <p><strong>Passengers:</strong> {booking_data.get('passengers', 'Not specified')}</p>
                <p><strong>Additional Notes:</strong> {booking_data.get('additional_notes', 'None')}</p>
            </body>
            </html>
            """
            
            plain_message = strip_tags(html_message)
            
            # Send email to admin
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],  # Send to admin
                html_message=html_message,
                fail_silently=False,
            )
            
            # Send confirmation email to customer
            customer_subject = "Booking Request Received - MSK Travels"
            customer_html_message = f"""
            <html>
            <body>
                <h2>Thank you for your booking request!</h2>
                <p>Dear {booking_data['customer_name']},</p>
                <p>We have received your booking request and will contact you soon to confirm the details.</p>
                <h3>Booking Details:</h3>
                <p><strong>From:</strong> {booking_data['from_location']}</p>
                <p><strong>To:</strong> {booking_data['to_location']}</p>
                <p><strong>Start Date:</strong> {booking_data['start_date']}</p>
                <p><strong>End Date:</strong> {booking_data['end_date']}</p>
                <p><strong>Vehicle Type:</strong> {booking_data.get('vehicle_type', 'Not specified')}</p>
                <p><strong>Passengers:</strong> {booking_data.get('passengers', 'Not specified')}</p>
                <p>We will get back to you within 24 hours with pricing and availability.</p>
                <p>Best regards,<br>MSK Travels Team</p>
            </body>
            </html>
            """
            
            customer_plain_message = strip_tags(customer_html_message)
            
            send_mail(
                subject=customer_subject,
                message=customer_plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[booking_data['customer_email']],
                html_message=customer_html_message,
                fail_silently=False,
            )
            
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
