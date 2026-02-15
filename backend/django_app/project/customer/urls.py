from django.urls import path
from customer.views import UserLogin,UserRegistrationForm,get_user_data,get_username,reset_password,set_new_password

urlpatterns = [
    path('user_signup/',UserRegistrationForm.as_view(),name="user_signup"),
    path('user_signin/',UserLogin.as_view(),name="user_signin"),
    path('user_data/',get_user_data),
    path('get_username/',get_username),
    path('forgot_password/',reset_password),
    path('reset_password/',set_new_password)
]
