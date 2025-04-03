from django.shortcuts import render
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
import random
from django.contrib.auth.models import User
from rest_framework import filters, generics, status
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

    # enable search for partial matching, currently not doing any ordering
    filter_backends = [DjangoFilterBackend, CustomSearchFilter, filters.OrderingFilter]

    search_fields = ['title', 'author', 'content']
    ordering_fields = ['created_at', 'title']
    filterset_fields = {
    "checked_out_by": ["exact"],
    }

    
    def get_queryset(self):
        
        queryset = Book.objects.all()
        # properly decode query params
        genre_param = self.request.query_params.get("genres", "")
        genre_names = genre_param.split(",") if genre_param else []
        if genre_names:
            # use greater than or equal to get the genre intersection + extras
            queryset = queryset.filter(genres__name__in=genre_names).annotate(
                genre_count=Count("genres")
            ).filter(genre_count__gte=len(genre_names))

        return queryset
    
class BookUpdateView(APIView):
    queryset=Book.objects.all()
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        book = Book.objects.get(pk=pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    
class GenreView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GenreSerializer

    # did I do this right?
    def get(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)