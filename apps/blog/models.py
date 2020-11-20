from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

STATUS = (
    (0, "Draft" ),
    (1, "Publish" )
)

class Post( models.Model ):
    title = models.CharField( max_length=200, unique=True )
    slug = models.SlugField( max_length=200, unique=True )
    author = models.ForeignKey( User, on_delete=models.CASCADE, related_name="blog_posts" )
    updated_on = models.DateTimeField( auto_now=True )
    content = models.TextField()
    created_on = models.DateTimeField( auto_now_add=True )
    status = models.IntegerField( choices=STATUS, default=0 )

    class Meta:
        ordering = [ "-created_on" ]

    def __str__( self ):
        return self.title

    def get_absolute_url( self ):
        return reverse(
            "questions:detail",
            kwargs={
                "slug": self.slug,
                "pk": self.pk
            }
        )


class Profile( models.Model ):
    user = models.OneToOneField( settings.AUTH_USER_MODEL, on_delete=models.CASCADE )
    date_of_birth = models.DateField( blank=True, null=True )
    photo = models.ImageField( upload_to="users/%Y/%m/%d/", blank=True )

    def __str__(self):
        return f"Profile for user {self.user.username}"