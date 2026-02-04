from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import random
# Create your views here.
# @api_view(['GET'])
# def get_data(request):
#     data={
#         "message":"hello my name is abhiraj shilkar"
#     }
#     return Response(data)

@api_view(['GET'])
def show_data(request):
    random_int=random.randint(0,10)
    data={
        "random_int": random_int
    }
    return Response(data)

# heyyy