from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Empresa, Usuario

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'telefono', 'suscripcion_activa')
    search_fields = ('nombre',)

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'empresa', 'is_active', 'is_staff')
    list_filter = ('empresa', 'is_active', 'is_staff', 'groups')
    search_fields = ('username', 'email', 'empresa__nombre')
    fieldsets = UserAdmin.fieldsets + (
        ('Información de empresa', {'fields': ('empresa',)}),
    )
    actions = ['activar_usuarios', 'archivar_usuarios']

    def activar_usuarios(self, request, queryset):
        queryset.update(is_active=True)
    activar_usuarios.short_description = "Marcar usuarios seleccionados como activos"

    def archivar_usuarios(self, request, queryset):
        queryset.update(is_active=False)
    archivar_usuarios.short_description = "Archivar (desactivar) usuarios seleccionados"
