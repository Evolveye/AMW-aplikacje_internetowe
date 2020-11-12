from . import views
from django.urls import path

urlpatterns = [
    path( "post/<slug:slug>/", views.PostDetail.as_view(), name="post_detail" ),
    path( "posts/new/", views.post_new, name="post_new" ),
    path( "", views.PostList.as_view(), name="home" ),
]