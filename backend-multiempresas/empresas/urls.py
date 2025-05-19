from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegistroEmpresaView,
    EstadoSuscripcionView,
    ActivarSuscripcionView,
    UsuarioViewSet,
    VerificarEmailView,
    EnviarCodigoRecuperacionView,
    ValidarCodigoOTPView,
    RestablecerContrasenaView,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('registro-empresa/', RegistroEmpresaView.as_view(), name='registro-empresa'),
    path('estado-suscripcion/', EstadoSuscripcionView.as_view(), name='estado-suscripcion'),
    path('activar-suscripcion/', ActivarSuscripcionView.as_view(), name='activar-suscripcion'),
    path('verificar-email/', VerificarEmailView.as_view(), name='verificar-email'),
    path('enviar-codigo-recuperacion/', EnviarCodigoRecuperacionView.as_view(), name='enviar-codigo-recuperacion'),
    path('verificar-codigo-otp/', ValidarCodigoOTPView.as_view(), name='verificar-codigo-otp'),
    path('restablecer-contrasena/', RestablecerContrasenaView.as_view(), name='restablecer-contrasena'),
]

urlpatterns += router.urls
