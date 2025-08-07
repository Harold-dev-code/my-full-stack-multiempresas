// Enviar código de recuperación
export async function enviarCodigoRecuperacion(email) {
  const response = await fetch(`${API_URL}/enviar-codigo-recuperacion/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || JSON.stringify(resData));
  }
  return resData;
}

// Verificar código OTP
export async function verificarCodigoOTP(email, codigo) {
  const response = await fetch(`${API_URL}/verificar-codigo-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || JSON.stringify(resData));
  }
  return resData;
}
const API_URL = "http://localhost:8000/api";

export async function registrarEmpresa(data) {
  const response = await fetch(`${API_URL}/registro-empresa/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    console.error("Error del backend:", resData);
    throw new Error(resData.mensaje || JSON.stringify(resData));
  }
  return resData;
}

export async function estadoSuscripcion(token) {
  try {
    const response = await fetch(`${API_URL}/estado-suscripcion/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      // Si el token es inválido o hay error, retorna null en vez de lanzar error
      return null;
    }
    return response.json();
  } catch (err) {
    // Si hay error de red, retorna null
    return null;
  }
}

export async function activarSuscripcion(token) {
  const response = await fetch(`${API_URL}/activar-suscripcion/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("No se pudo activar la suscripción");
  }
  return response.json();
}

export async function verificarEmail(email) {
  const response = await fetch("http://localhost:8000/api/verificar-email/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.detail || JSON.stringify(resData));
  }
  return resData;
}
