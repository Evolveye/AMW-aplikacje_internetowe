from . import views
from django.urls import path

urlpatterns = [
    path( "post/<slug:slug>/edit/", views.post_edit, name="post_edit" ),
    path( "post/<slug:slug>/", views.post_details, name="post_details" ),
    path( "posts/new/", views.post_new, name="post_new" ),
    path( "", views.PostList.as_view(), name="home" ),
]