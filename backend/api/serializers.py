from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Book, Genre

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class BookSerializer(serializers.ModelSerializer):
    genres = serializers.ListField(child=serializers.CharField(), write_only=True)
    genre_objects = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "content", "created_at", "genres", "genre_objects", "publication_date", "author", "checked_out_by", "status"]

    def create(self, validated_data):
        # extract genre names and keywords from request
        genre_names = validated_data.pop("genres", [])
        book = Book.objects.create(**validated_data)
        for name in genre_names:
            # create genre if it doesn't exist
            genre, _ = Genre.objects.get_or_create(name=name)
            book.genres.add(genre)
        return book
    
    def get_genre_objects(self, obj):
        # genre names associated with the book
        return [genre.name for genre in obj.genres.all()]