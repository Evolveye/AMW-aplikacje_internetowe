from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post, Task


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'author', 'title', 'body', 'created_at',)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username',)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        # fields = ('id', 'title', 'done', 'body', 'created_at',)
        fields = ('id', 'title', 'body', 'created_at',)
