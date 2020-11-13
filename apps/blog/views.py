from django.template.defaultfilters import slugify
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.views import generic
from .models import Post
from .forms import PostForm

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
            post.author = request.user
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
        post.title = form.data[ "content" ]
        post.updated_on = timezone.now()
        post.save()

        return redirect( "post_details", slug=slug )

    else:
        form = PostForm( initial={ "title":post.title, "content":post.content } )

    return render( request, "post_edit.html", { "form":form } )