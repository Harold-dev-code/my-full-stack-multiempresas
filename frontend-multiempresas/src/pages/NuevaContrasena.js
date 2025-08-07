import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import textura from "../assets/img/textura.png";
import "../App.css";

export default function NuevaContrasena() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, codigo } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/restablecer-contrasena/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo, nueva_contrasena: password })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `url(${textura}) center/cover no-repeat` }}>
        <div className="card" style={{ maxWidth: 400, width: "100%", background: "var(--color-card)", boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: 18, padding: "2.5rem 2rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--color-gold)", fontWeight: 700, marginBottom: 8 }}>¡Contraseña actualizada!</h2>
          <p style={{ color: "var(--color-white)", fontSize: "1.1rem", marginBottom: 24 }}>
            Tu contraseña ha sido restablecida exitosamente.<br />Serás redirigido al login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `url(${textura}) center/cover no-repeat` }}>
      <div className="card" style={{ maxWidth: 400, width: "100%", background: "var(--color-card)", boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: 18, padding: "2.5rem 2rem" }}>
        <h2 style={{ color: "var(--color-gold)", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Nueva contraseña</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            style={{ width: "100%", marginBottom: 12 }}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="input"
            style={{ width: "100%", marginBottom: 12 }}
            required
          />
          <button className="button-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
          {error && <div style={{ color: "#ff5252", marginTop: 10, fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
