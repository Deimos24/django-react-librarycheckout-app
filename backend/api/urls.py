from django.urls import path
from . import views

urlpatterns = [
    path("books/", views.BookListCreate.as_view(), name="book-list"),
    path("book-count/", views.BookCountView.as_view(), name="book-count"),
    path("random-book/", views.GetRandomBook.as_view(), name="random-book"),
    path("current-user/", views.CurrentUserView.as_view(), name="current-user"),
]