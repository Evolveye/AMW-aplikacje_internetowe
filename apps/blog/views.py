from django.template.defaultfilters import slugify
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from django.views import generic
from django.http import HttpResponse

from .models import Post, Profile
from .forms import PostForm, UserRegistrationForm, LoginForm, UserEditForm, ProfileEditForm

# Create your views here.

class PostList( generic.ListView ):
    queryset = Post.objects.filter( status=1 ).order_by( "-created_on" )
    template_name = "index.html"



def post_details( request, slug ):
    if request.method == "POST":
        Post.objects.filter( slug=slug ).first().delete()

        return redirect( "home" )

    post = get_object_or_404( Post, slug=slug )

    return render( request, "post_details.html", { "post":post } )



def post_new( request ):
    if Post.objects.count() >= 10:
        return redirect( "home" )

    if request.method == "POST":
        form = PostForm( request.POST )
        slug = slugify( form.data[ "title" ] )

        if Post.objects.filter( slug=slug ).first() != None:
            form.add_error( "title", "Slug made from passed title is not unique!" )

        elif form.is_valid():
            post = form.save( commit=False )
            post.author = User.objects.first()
            post.published_date = timezone.now()
            post.status = 1
            post.slug = slug
            post.save()

            return redirect( "post_details", slug=post.slug )

    else:
        form = PostForm()

    return render( request, "post_new.html", { "form":form } )



def post_edit( request, slug ):
    post = Post.objects.filter( slug=slug ).first()

    if request.method == "POST":
        form = PostForm( request.POST )

        post.title = form.data[ "title" ]
        post.content = form.data[ "content" ]
        post.updated_on = timezone.now()
        post.save()

        return redirect( "post_details", slug=slug )

    else:
        form = PostForm( initial={ "title":post.title, "content":post.content } )

    return render( request, "post_edit.html", { "form":form } )



def register( request ):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            # Create a new user object but avoid saving it yet
            new_user = user_form.save(commit=False)
            # Set the chosen password
            new_user.set_password(
                user_form.cleaned_data['password'])
            # Save the User object
            new_user.save()
            # Create the user profile
            Profile.objects.create(user=new_user)
            return render(request,
                          'account/register_done.html',
                          {'new_user': new_user})
    else:
        user_form = UserRegistrationForm()
    return render(request,
                  'account/register.html',
                  {'user_form': user_form})



@login_required
def user_logout( request ):
    logout( request )
    return redirect( "home" )



@login_required
def user_profile( request ):
    return render( request, "account/profile.html" )



@login_required
def user_edit( request ):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user,
                                 data=request.POST)
        profile_form = ProfileEditForm(
                                    instance=request.user.profile,
                                    data=request.POST,
                                    files=request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Profile updated successfully')
        else:
            messages.warning(request, 'Be careful!')
            messages.error(request, 'Error updating your profile')
    else:
        user_form = UserEditForm(instance=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)
    return render(request,
                  'account/edit.html',
                  {'user_form': user_form,
                   'profile_form': profile_form})