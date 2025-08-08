import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../api/auth";
import { estadoSuscripcion, activarSuscripcion } from "../api/empresa";
import "./Suscripcion.css";

const planes = [
  {
    nombre: "Básico",
    precio: 10,
    periodo: "mes",
    caracteristicas: [
      "Hasta 5 usuarios",
      "Soporte básico",
      "Funciones esenciales",
      "Backups semanales"
    ],
    popular: false
  },
  {
    nombre: "Profesional",
    precio: 25,
    periodo: "mes",
    caracteristicas: [
      "Hasta 20 usuarios",
      "Soporte prioritario",
      "Todas las funciones básicas",
      "Backups diarios",
      "Reportes avanzados"
    ],
    popular: true
  },
  {
    nombre: "Empresarial",
    precio: 50,
    periodo: "mes",
    caracteristicas: [
      "Usuarios ilimitados",
      "Soporte 24/7",
      "Todas las funciones",
      "Backups en tiempo real",
      "API personalizada",
      "Personalización total"
    ],
    popular: false
  }
];

export default function EstadoSuscripcion() {
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    const token = getAccessToken();
    const res = await estadoSuscripcion(token);
    if (res) setEstado(res);
  };

  const handleActivar = async (plan) => {
    setCargando(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      const token = getAccessToken();
      const res = await activarSuscripcion(token);
      setMensaje({ 
        tipo: "exito", 
        texto: `¡Felicidades! Has activado el plan ${plan.nombre} correctamente.`
      });
      await cargarEstado();
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setMensaje({ 
        tipo: "error", 
        texto: "Error al activar la suscripción. Por favor, intenta de nuevo."
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="suscripcion-container">
      <div className="suscripcion-header">
        <h2>Planes y Suscripciones</h2>
        <p>Elige el plan que mejor se adapte a las necesidades de tu empresa</p>
      </div>

      {/* Estado actual de la suscripción */}
      {estado && (
        <div className="estado-actual">
          <h3>Estado Actual</h3>
          <div className="estado-info">
            <div className="estado-item">
              <div className="estado-item-label">Empresa</div>
              <div className="estado-item-value">{estado.empresa}</div>
            </div>
            <div className="estado-item">
              <div className="estado-item-label">Estado</div>
              <div className="estado-item-value" style={{ color: estado.suscripcion_activa ? '#2ed573' : '#ff4757' }}>
                {estado.suscripcion_activa ? "Suscripción Activa" : "Sin Suscripción Activa"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de planes */}
      <div className="planes-grid">
        {planes.map((plan) => (
          <div key={plan.nombre} className="plan-card">
            {plan.popular && <div className="plan-popular">Más Popular</div>}
            <h3 className="plan-name">{plan.nombre}</h3>
            <div className="plan-price">
              ${plan.precio}<span>/{plan.periodo}</span>
            </div>
            <ul className="plan-features">
              {plan.caracteristicas.map((caracteristica, index) => (
                <li key={index}>{caracteristica}</li>
              ))}
            </ul>
            <button
              className="btn-activar"
              onClick={() => handleActivar(plan)}
              disabled={cargando || (estado && estado.suscripcion_activa)}
            >
              {cargando ? "Activando..." : 
               (estado && estado.suscripcion_activa) ? "Suscripción Activa" : 
               `Activar Plan ${plan.nombre}`}
            </button>
          </div>
        ))}
      </div>

      {/* Mensajes de éxito o error */}
      {mensaje.texto && (
        <div className={mensaje.tipo === "exito" ? "mensaje-exito" : "mensaje-error"}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}