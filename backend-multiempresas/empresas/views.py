from django.shortcuts import render
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from .models import Empresa, Usuario
from .serializers import RegistroEmpresaSerializer, UsuarioSerializer
from django.db import transaction
import random
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import CodigoRecuperacion

# Registro de empresa y usuario administrador
class RegistroEmpresaView(APIView):
    def post(self, request):
        serializer = RegistroEmpresaSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response({'mensaje': 'Empresa y usuario creados correctamente.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Consulta del estado de suscripción de la empresa
class EstadoSuscripcionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        usuario = request.user
        empresa = usuario.empresa
        if empresa:
            return Response({
                'empresa': empresa.nombre,
                'suscripcion_activa': empresa.suscripcion_activa
            })
        else:
            return Response({'detalle': 'El usuario no está vinculado a ninguna empresa.'}, status=400)

# Activación de la suscripción de la empresa
class ActivarSuscripcionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        usuario = request.user
        empresa = usuario.empresa
        if empresa:
            empresa.suscripcion_activa = True
            empresa.save()
            return Response({'mensaje': 'Suscripción activada correctamente.'})
        else:
            return Response({'detalle': 'El usuario no está vinculado a ninguna empresa.'}, status=400)

# CRUD de usuarios de empresa (solo admin de empresa)
class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        empresa = self.request.user.empresa
        return Usuario.objects.filter(empresa=empresa)
    def perform_create(self, serializer):
        serializer.save(empresa=self.request.user.empresa)
    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Solo el administrador de la empresa puede crear usuarios.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Solo el administrador de la empresa puede editar usuarios.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Solo el administrador de la empresa puede editar usuarios.'}, status=status.HTTP_403_FORBIDDEN)
        if 'is_active' in request.data:
            instance = self.get_object()
            instance.is_active = request.data['is_active']
            instance.save()
            return Response(self.get_serializer(instance).data)
        return super().partial_update(request, *args, **kwargs)
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Solo el administrador de la empresa puede eliminar usuarios.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

# Login JWT personalizado (mensaje claro para usuario archivado/inactivo)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = Usuario.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed('Credenciales incorrectas.')
        if not user.is_active:
            raise AuthenticationFailed('El usuario está archivado o inactivo. Contacte al administrador.')
        if not user.check_password(password):
            raise AuthenticationFailed('Credenciales incorrectas.')
        data = super().validate(attrs)
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Verificación de email para recuperación de contraseña
class VerificarEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'existe': False, 'error': 'Email no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
        usuario = Usuario.objects.filter(email=email, is_active=True).first()
        if usuario:
            return Response({'existe': True})
        else:
            return Response({'existe': False, 'error': 'No existe una cuenta activa con ese correo.'}, status=status.HTTP_400_BAD_REQUEST)

class EnviarCodigoRecuperacionView(APIView):
    def post(self, request):
        email = request.data.get('email')
        usuario = Usuario.objects.filter(email=email, is_active=True).first()
        if not usuario:
            return Response({'exito': False, 'error': 'Email no encontrado o usuario inactivo.'}, status=400)
        # Generar código OTP
        codigo = f'{random.randint(100000, 999999)}'
        expiracion = timezone.now() + timedelta(minutes=10)
        CodigoRecuperacion.objects.create(usuario=usuario, codigo=codigo, expiracion=expiracion)
        # Enviar email
        send_mail(
            'Tu código de recuperación',
            f'Tu código de recuperación es: {codigo}',
            'noreply@tuapp.com',
            [email],
            fail_silently=False,
        )
        return Response({'exito': True, 'mensaje': 'Código enviado al correo.'})

# --- Validar código OTP ---
class ValidarCodigoOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        codigo = request.data.get('codigo')
        usuario = Usuario.objects.filter(email=email, is_active=True).first()
        if not usuario:
            return Response({'ok': False, 'error': 'Usuario no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
        codigo_obj = CodigoRecuperacion.objects.filter(usuario=usuario, codigo=codigo).first()
        if not codigo_obj or codigo_obj.is_expired():
            return Response({'ok': False, 'error': 'Código inválido o expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'ok': True, 'mensaje': 'Código válido.'})

# --- Restablecer contraseña usando OTP ---
class RestablecerContrasenaView(APIView):
    def post(self, request):
        email = request.data.get('email')
        codigo = request.data.get('codigo')
        nueva_contrasena = request.data.get('nueva_contrasena')
        usuario = Usuario.objects.filter(email=email, is_active=True).first()
        if not usuario:
            return Response({'ok': False, 'error': 'Usuario no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
        codigo_obj = CodigoRecuperacion.objects.filter(usuario=usuario, codigo=codigo).first()
        if not codigo_obj or codigo_obj.is_expired():
            return Response({'ok': False, 'error': 'Código inválido o expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        if not nueva_contrasena or len(nueva_contrasena) < 6:
            return Response({'ok': False, 'error': 'La contraseña debe tener al menos 6 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        usuario.set_password(nueva_contrasena)
        usuario.save()
        # Elimina el código usado
        codigo_obj.delete()
        return Response({'ok': True, 'mensaje': 'Contraseña restablecida correctamente.'})
