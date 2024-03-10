from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    name = models.CharField(max_length = 255)
    email = models.EmailField(max_length = 255, unique = True)
    password = models.CharField(max_length = 255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []    


    
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='images/', default=None)
    colorized_image = models.ImageField(upload_to='colorized_image/', blank=True, null=True)
