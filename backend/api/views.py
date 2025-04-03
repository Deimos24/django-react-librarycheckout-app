from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
import random
from django.contrib.auth.models import User
from rest_framework import filters, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, BookSerializer, GenreSerializer
from .custom_filters import CustomSearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Book, Genre

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    # enable filtering for genres (exact matches) and enable search for partial matching
    # still need all these backends?
    filter_backends = [DjangoFilterBackend, CustomSearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'genres__name': ['exact'],
    }
    search_fields = ['title', 'author', 'content']

    ordering_fields = ['created_at', 'title']

class BookCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        book_count = Book.objects.count()
        return Response({"count": book_count})

class GetRandomBook(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.filter(status="available")
        if books.exists():
            book = random.choice(books)
            serializer = BookSerializer(book)
            return Response(serializer.data)
        return Response({"error": "No available books"}, status=404)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class GenreView(APIView):
    permission_classes = [IsAuthenticated]

    # did I do this right?
    def get(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)