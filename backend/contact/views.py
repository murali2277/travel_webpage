from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactMessageCreateSerializer

class ContactCreateView(APIView):
    def post(self, request):
        """Create a new contact message"""
        serializer = ContactMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            contact_message = serializer.save()
            return Response({
                'message': 'Thank you for your message! We will get back to you soon.',
                'id': contact_message.id
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 