from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Book, Genre, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["is_admin"]

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["name"]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user
    

class BookSerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()
    # status_display = serializers.SerializerMethodField()


    class Meta:
        model = Book
        fields = ["id", "title", "content", "created_at", "genres", "publication_date", "author", "checked_out_by", "status",]

    def create(self, validated_data):
        # extract genre names and keywords from request
        genre_names = validated_data.pop("genres", [])
        book = Book.objects.create(**validated_data)
        for name in genre_names:
            # create genre if it doesn't exist
            genre, _ = Genre.objects.get_or_create(name=name)
            book.genres.add(genre)
        return book
    
    def get_genres(self, obj):
        # genre names associated with the book
        return [genre.name for genre in obj.genres.all()]
    
    # def get_status_display(self, obj):
    #     return obj.get_status_display()