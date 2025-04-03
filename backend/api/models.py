from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    
class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class Book(models.Model):

    STATUS_CHOICES = [
        ("available", "Available!"),
        ("checked_out", "Checked Out"),
    ]

    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    content = models.TextField()
    publication_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True,)
    genres = models.ManyToManyField(Genre, blank=True)
    checked_out_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="available")

    def __str__(self):
        return f"\"{self.title}\" by {self.author}"
    
    def save(self, *args, **kwargs):
        if self.checked_out_by:
            self.status = "checked_out"
        else:
            self.status = "available"
        super().save(*args, **kwargs)

    # not sure if clearing genre connections before deleting is needed
    # doesn't work in dbeaver
    
    # def delete(self, *args, **kwargs):
    #     self.genres.clear()
    #     super().delete(*args, **kwargs)
    
