from django.db import models


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return (
            f"Message from {self.name} - "
            f"{self.created_at.strftime('%Y-%m-%d %H:%M')}"
        )

    class Meta:
        ordering = ['-created_at']
