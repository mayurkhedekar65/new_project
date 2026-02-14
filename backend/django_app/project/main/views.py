import os
import uuid
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from customer.models import LLMResponse
from django.contrib.auth.models import User
import requests
from markitdown import MarkItDown



def file_text_extract(file):
        temp_path = None
        text = None
        md = MarkItDown()
        temp_path = f"temp_{uuid.uuid4()}_{file}"
        f = open(temp_path, "wb")
        for chunk in file.chunks():
            f.write(chunk)
        f.close()

        try:
            result = md.convert(temp_path)
            text = result.text_content
            print(text)
        except Exception as e:
            if not isinstance(text, str):
                return None
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        return text



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    user_instance=User.objects.get(id=request.user.id)
    user_input_data=request.data.get("text_data")
    file=request.FILES.get("file")
    num_of_questions=request.data.get("num_of_questions")
    if user_input_data:
        response = requests.get("http://127.0.0.1:8001/generate_quiz", json={"text": user_input_data,"num_of_questions":num_of_questions})
        LLMResponse.objects.create(user=user_instance,user_input=user_input_data,llm_response=response.json())
        return JsonResponse({"user_input":user_input_data,"generated_quiz_data":response.json()}, safe=False)
    else:
        text = file_text_extract(file)
        if not text:
            return JsonResponse({"error": "Failed to extract text"}, status=400)
        response = requests.get("http://127.0.0.1:8001/generate_quiz", json={"text": text,"num_of_questions":num_of_questions})
        LLMResponse.objects.create(user=user_instance,user_input=text,llm_response=response.json())
        return JsonResponse({"user_input":text,"generated_quiz_data":response.json()}, safe=False)

