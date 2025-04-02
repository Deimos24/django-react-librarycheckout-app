from django.shortcuts import render
import random
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, BookSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Book

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    # more features to add:
    # file handling to add books to the library
    # serializer.is_valid() logic when create a new book

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