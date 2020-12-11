from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Moje-posty"

    def __str__(self):
        return self.title


class Task(models.Model):
    title = models.CharField(max_length=50)
    # done = models.CheckConstraint( check=False, name="done" )
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Zadania-do-wykonania"

    def __str__(self):
        done = "X" if self.done else " "

        return f"[{done}]" + self.title