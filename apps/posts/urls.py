from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import UserViewSet, UserList, UserDetail
from .views import PostViewSet, PostList, PostDetail
from .views import TaskViewSet, TaskList, TaskDetail


urlpatterns = [
    # path('users/', UserList.as_view()),
    # path('users/<int:pk>/', UserDetail.as_view()),

    # path('tasks/', TaskList.as_view()),
    # path('tasks/<int:pk>/', TaskDetail.as_view()),

    # path('<int:pk>/', PostDetail.as_view()),
    # path('', PostList.as_view()),
]

router = SimpleRouter()
router.register('tasks', TaskViewSet, basename='tasks')
router.register('users', UserViewSet, basename='users')
router.register('', PostViewSet, basename='posts')

urlpatterns += router.urls
