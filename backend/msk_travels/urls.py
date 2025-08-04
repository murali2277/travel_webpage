from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

def get_csrf_token(request):
    """Get CSRF token for React frontend"""
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE', '')})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('vehicles.urls')),
    path('api/', include('bookings.urls')),
    path('api/', include('contact.urls')),
    path('api/csrf-token/', ensure_csrf_cookie(get_csrf_token), name='csrf_token'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 