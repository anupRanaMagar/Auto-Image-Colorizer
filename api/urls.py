from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, ImageView, ColorizedImageView, AllImageView, DeleteImageView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('products/', ImageView.as_view()),
    path('colorized-image/', ColorizedImageView.as_view(), name='colorized_image'),
    path('all-images/', AllImageView.as_view(), name='all_images'),
    path('delete-image/<int:image_id>/', DeleteImageView.as_view(), name='delete_image'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)