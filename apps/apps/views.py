from django.shortcuts import render
from django.urls import get_resolver

def root( request ):
    return render( request, "index.html" )