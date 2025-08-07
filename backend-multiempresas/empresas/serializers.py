from rest_framework import serializers
from .models import Empresa, Usuario
from django.db import transaction

class RegistroEmpresaSerializer(serializers.Serializer):
    nombre_empresa = serializers.CharField(max_length=255)
    direccion = serializers.CharField(max_length=255, allow_blank=True)
    telefono = serializers.CharField(max_length=50, allow_blank=True)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if Empresa.objects.filter(nombre=data['nombre_empresa']).exists():
            raise serializers.ValidationError('Ya existe una empresa con ese nombre.')
        if Usuario.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError('Ya existe un usuario con ese nombre de usuario.')
        if Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError('Ya existe un usuario con ese email.')
        return data

    def create(self, validated_data):
        with transaction.atomic():
            empresa = Empresa.objects.create(
                nombre=validated_data['nombre_empresa'],
                direccion=validated_data['direccion'],
                telefono=validated_data['telefono'],
                suscripcion_activa=False
            )
            usuario = Usuario.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                empresa=empresa,
                is_staff=True
            )
        return usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'empresa', 'password']
        read_only_fields = ['id', 'empresa']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)
        else:
            usuario.set_unusable_password()
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def validate(self, data):
        # Validar email único solo para creación
        if self.instance is None and Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Ya existe un usuario con ese email.'})
        return data
