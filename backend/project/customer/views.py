from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.view import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.permissons import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from models import Customer
from serializer import CustomerRegistrationFormSerializer
# Create your views here.


class UserRegistrationForm(APIView):
    permission_classes[AllowAny]

    def post(self, request, format=None):
        serializer=CustomerRegistrationFormSerializer(data=request.data)
        if serializer.is_valid():
            customer_name = request.data.get('name')
            customer_email = request.data.get('email')
            customer_password = request.data.get('password')

            if User.objects.filter(email=customer_email).exists():
                return Response({"message": "user already exist...!"},
                                status=status.HTTP_400_BAD_REQUEST)
            user=User.objects.create(username=customer_email,email=customer_email)
            user.set_password(customer_password)
            user.save()
            
            Customer.objects.create(customer=user,name=customer_name,email=customer_email)
            
            return Response({"message":"user successfully register"})
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
    
class UserLogin(APIView):
    permission_classes=[]
    def post(self, request, format=None):
        customer_email = request.data.get('email')
        customer_password = request.data.get('password')
        try:
            user_obj=User.objects.get(username=customer_email)
            user=authenticate(username=user_obj.username,password=customer_password)
            if user is not None:
                try: 
                    is_customer=Customer.objects.filter(email=customer_email).exists()
                    if not is_customer:
                        Response({"message","user profile not found!"},status=status.HTTP_403_FORBIDDEN)
                    refresh=RefreshToken.for_user(user)
                    return Response(
                        {
                            "message":"user logged in successfully",
                            "access" : str(refresh.access_token),
                            "refresh":str(refresh)
                        },
                        status=status.HTTP_200_OK)
                except:
                    return Response({"message":"user email not found!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message","invalid credentials!"},status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
           return Response({"message": "user not registerd"},status=status.HTTP_400_BAD_REQUEST)