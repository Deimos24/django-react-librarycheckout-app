from django.contrib import admin
from .models import Book, Genre, UserProfile

# Register your models here.
admin.site.register(Book)
admin.site.register(Genre)
admin.site.register(UserProfile)