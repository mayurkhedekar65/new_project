from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from customer.models import LLMResponse
from django.contrib.auth.models import User
import requests


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    user_instance=User.objects.get(id=request.user.id)
    user_input_data=request.data.get("text_data")
    num_of_questions=request.data.get("num_of_questions")
    response = requests.get("http://127.0.0.1:8001/generate_quiz", json={"text": user_input_data,"num_of_questions":num_of_questions})
    LLMResponse.objects.create(user=user_instance,user_input=user_input_data,llm_response=response.json())
    return JsonResponse(response.json(), safe=False)
