import os
import uuid
import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from customer.models import LLMResponse
from django.contrib.auth.models import User
from markitdown import MarkItDown
from common.email import send_email


# extracts the text from pdf,doc and returns a plan text
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
    except Exception as e:
        if not isinstance(text, str):
            return None
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
    return text


# sends request to fastapi server , creates a new llm response entry in the table & returns the llm response in json format
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    user_instance = User.objects.get(id=request.user.id)
    user_input_data = request.data.get("text_data")
    file = request.FILES.get("file")
    num_of_questions = request.data.get("num_of_questions")
    if user_input_data:
        response = requests.get("http://127.0.0.1:8001/generate_quiz", json={
                                "text": user_input_data, "num_of_questions": num_of_questions})
        quiz = LLMResponse.objects.create(
            user=user_instance, user_input=user_input_data, llm_response=response.json())
        return JsonResponse({"id": quiz.id, "user_input": user_input_data, "generated_quiz_data": response.json()}, safe=False)
    else:
        text = file_text_extract(file)
        if not text:
            return JsonResponse({"error": "Failed to extract text"}, status=400)
        response = requests.get("http://127.0.0.1:8001/generate_quiz",
                                json={"text": text, "num_of_questions": num_of_questions})
        quiz = LLMResponse.objects.create(
            user=user_instance, user_input=text, llm_response=response.json())
        return JsonResponse({"id": quiz.id, "user_input": text, "generated_quiz_data": response.json()}, safe=False)


# sends the feedback email to the admin
@api_view(['POST'])
@permission_classes([AllowAny])
def submit_feedback_form(request):
    user_name = request.data.get("name")
    user_email = request.data.get("email")
    user_message = request.data.get("message")
    default_email = "support@quizizeai.com"
    mail_sub = f"New Feedback Submitted by {user_name}"
    message = f"""
    You have received new feedback from a user.

    User Details:

    Name: {user_name}

    Email: {user_email}

    Message: {user_message}

    Please review the feedback and respond to the user if required.

    Quizizeai System Notification
    """
    try:
        send_email(request, user_email, default_email, message, mail_sub)
    except Exception as e:
        print(f"Reset email failed: {str(e)}")
    return Response({"message": "feedback form submitted via email."})
