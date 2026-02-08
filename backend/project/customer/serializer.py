from rest_framework import serializers

class CustomerRegistrationFormSerializer(serializers.Serializer):
    name=serializers.CharField()
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)
    