from django.template.defaultfilters import slugify
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import generic
from .models import Post
from .forms import PostForm

# Create your views here.

class PostList( generic.ListView ):
    queryset = Post.objects.filter( status=1 ).order_by( "-created_on" )
    template_name = "index.html"

class PostDetail( generic.DetailView ):
    model = Post
    template_name = "post_detail.html"

def post_new( request ):
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

            return redirect( "post_detail", slug=post.slug )

    else:
        form = PostForm()

    return render( request, "post_edit.html", { "form":form } )