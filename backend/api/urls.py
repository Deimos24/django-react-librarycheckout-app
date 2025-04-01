from django.urls import path
from . import views

urlpatterns = [
    path("books/", views.BookListCreate.as_view(), name="book-list"),
    path("book-count/", views.BookCountView.as_view(), name="book-count"),
]