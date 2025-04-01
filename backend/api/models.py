from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):

    STATUS_CHOICES = [
        ("available", "Available"),
        ("checked_out", "Checked Out"),
    ]

    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=100)
    publication_date = models.DateField(null=True, blank=True)
    genres = models.ManyToManyField("Genre", blank=True)
    checked_out_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="available")

    def __str__(self):
        return f"{self.title} by {self.author}"
    
    def save(self, *args, **kwargs):
        if self.checked_out_by:
            self.status = "checked_out"
        else:
            self.status = "available"
        super().save(*args, **kwargs)
    
class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name