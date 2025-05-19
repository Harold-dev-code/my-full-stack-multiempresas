from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class Empresa(models.Model):
    nombre = models.CharField(max_length=255, unique=True)
    direccion = models.CharField(max_length=255, blank=True)
    telefono = models.CharField(max_length=50, blank=True)
    suscripcion_activa = models.BooleanField(default=False, verbose_name="Suscripción activa")

    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    empresa = models.ForeignKey(Empresa, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    # El campo is_active ya existe en AbstractUser y se usará para archivar usuarios

    def __str__(self):
        return f"{self.username} ({self.empresa})"

class CodigoRecuperacion(models.Model):
    usuario = models.ForeignKey('empresas.Usuario', on_delete=models.CASCADE)
    codigo = models.CharField(max_length=6)
    creado = models.DateTimeField(auto_now_add=True)
    expiracion = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expiracion
