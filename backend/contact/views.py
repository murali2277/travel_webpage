from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
from .serializers import ContactMessageCreateSerializer


class ContactCreateView(APIView):
    def post(self, request):
        """Create a new contact message and send notifications"""
        serializer = ContactMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            contact_message = serializer.save()
            
            # Send email notification
            try:
                self.send_contact_email(contact_message)
            except Exception as e:
                print(f"Email notification sending failed: {str(e)}")
                # Continue with success response even if notifications fail
            
            return Response({
                'message': 'Thank you for your message! We will get back to you soon.',
                'id': contact_message.id
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def send_contact_email(self, contact_message):
        """Send contact form email notifications"""
        try:
            # Email to admin
            admin_subject = f"New Contact Message - {contact_message.name}"
            admin_html_message = f"""
            <html>
            <body>
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> {contact_message.name}</p>
                <p><strong>Email:</strong> {contact_message.email}</p>
                <p><strong>Phone:</strong> {getattr(contact_message, 'phone', 'Not provided')}</p>
                <p><strong>Subject:</strong> {contact_message.subject}</p>
                <p><strong>Message:</strong></p>
                <p>{contact_message.message}</p>
            </body>
            </html>
            """
            
            admin_plain_message = strip_tags(admin_html_message)
            
            send_mail(
                subject=admin_subject,
                message=admin_plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                html_message=admin_html_message,
                fail_silently=False,
            )
            
            # Confirmation email to customer
            customer_subject = "Message Received - MSK Travels"
            customer_html_message = f"""
            <html>
            <body>
                <h2>Thank you for contacting us!</h2>
                <p>Dear {contact_message.name},</p>
                <p>We have received your message and will get back to you soon.</p>
                <h3>Your Message:</h3>
                <p><strong>Subject:</strong> {contact_message.subject}</p>
                <p><strong>Message:</strong></p>
                <p>{contact_message.message}</p>
                <p>We will respond within 24 hours.</p>
                <p>Best regards,<br>MSK Travels Team</p>
            </body>
            </html>
            """
            
            customer_plain_message = strip_tags(customer_html_message)
            
            send_mail(
                subject=customer_subject,
                message=customer_plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[contact_message.email],
                html_message=customer_html_message,
                fail_silently=False,
            )
            
        except Exception as e:
            print(f"Contact email sending failed: {str(e)}")
