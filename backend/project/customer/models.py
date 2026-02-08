from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Customer(User):
    customer_name=models.CharField(max_length=30,null=False,blank=False)
    customer_email=models.EmailField(max_length=50,null=False,blank=False)