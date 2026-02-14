from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from customer.models import Customer,LLMResponse
from customer.serializer import CustomerRegistrationFormSerializer
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from common.email import send_email
# Create your views here.


class UserRegistrationForm(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
       
        serializer = CustomerRegistrationFormSerializer(data=request.data)
        if serializer.is_valid():

            customer_email_id = request.data.get('customer_email')
            customer_password = request.data.get('password')
            
            if User.objects.filter(email=customer_email_id).exists():
                return Response({"message": "user already exist...!"},
                                status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create(
                username=customer_email_id, email=customer_email_id)
            user.set_password(customer_password)
            user.save()

            Customer.objects.create(customer=user,customer_email=customer_email_id)

            return Response({"message": "user successfully register"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = []

    def post(self, request, format=None):
        customer_email_id = request.data.get('customer_email')
        customer_password = request.data.get('password')
        try:
            user_obj = User.objects.get(username=customer_email_id)
            user = authenticate(username=user_obj.username,
                                password=customer_password)
            if user is not None:
                try:
                    is_customer = Customer.objects.filter(
                        customer_email=customer_email_id).exists()
                    if not is_customer:
                        Response({"message", "user profile not found!"},
                                 status=status.HTTP_403_FORBIDDEN)
                    refresh = RefreshToken.for_user(user)
                    return Response(
                        {
                            "message": "user logged in successfully",
                            "access": str(refresh.access_token),
                            "refresh": str(refresh)
                        },
                        status=status.HTTP_200_OK)
                except:
                    return Response({"message": "user email not found!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message", "invalid credentials!"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message": "user not registerd"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user_data=LLMResponse.objects.filter(user=request.user.id).order_by("-id").values("id","user_input","llm_response")
    return Response({"user_data":user_data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    username=User.objects.filter(id=request.user.id).values("username")
    return Response({"username":username})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    reset_email = request.data.get("email")
    user = User.objects.filter(email = reset_email).first()
    if not user:
        return Response({"message": "user not found!"}, status=status.HTTP_404_NOT_FOUND)
    
    uid = urlsafe_base64_encode(force_bytes(user.id))
    token = PasswordResetTokenGenerator().make_token(user)
    default_email = "contact@quizize.ai"
    mail_sub = "Password Reset Link"
    
    message = f"""
    Hello,

    You requested a password reset for your account. Click on the link below to set a new password:

    http://127.0.0.1:5173/resetpassword/?uid={uid}&token={token}

    If you did not request this, please ignore this email.

    Best regards,
    SHG Bazar Support Team
    """
    
    try:
        send_email(request, default_email, reset_email, message, mail_sub)
    except Exception as e:
        print(f"Reset email failed: {str(e)}")

    return Response({"message": "Reset link generated and sent to your email."})
