from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path( "register/", views.register, name="register" ),
    # path( "login/", views.user_login, name="login" ),
    path( "login/", auth_views.LoginView.as_view( template_name="account/login.html" ), name="login" ),
    path( "logout/", views.user_logout, name="logout" ),
    path( "password_reset/", auth_views.PasswordResetView.as_view(), name="password_reset" ),
    path( "password_change/", auth_views.PasswordChangeView.as_view( template_name="account/password_change.html" ), name="password_change" ),
    path( "password_change/done/", auth_views.PasswordChangeDoneView.as_view(),  name="password_change_done" ),
    path( "profile/", views.user_profile, name="profile" ),
    path( "edit/", views.user_edit, name="edit" ),

    path( "post/<slug:slug>/edit/", views.post_edit, name="post_edit" ),
    path( "post/<slug:slug>/", views.post_details, name="post_details" ),
    path( "posts/new/", views.post_new, name="post_new" ),

    path( "", views.PostList.as_view(), name="home" ),
]