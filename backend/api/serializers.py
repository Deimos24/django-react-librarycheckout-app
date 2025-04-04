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

    # mishandling the list of genres somehow, POST and GET aren't playing nice

    # for GET requests: return a list of genre names
    genres = serializers.SlugRelatedField(queryset=Genre.objects.all(), slug_field="name", many=True)

    class Meta:
        model = Book
        fields = ["id", "title", "content", "created_at", "genres", "publication_date", "author", "checked_out_by", "status",]

    def create(self, validated_data):
        # extract genres and add them
        genre_names = validated_data.pop('genres', [])
        book = Book.objects.create(**validated_data)

        # this feels off
        for name in genre_names:
            genre = Genre.objects.get(name=name)
            book.genres.add(genre)
        
        return book