import React, { useState } from "react";
import InputFloatingLabel from "../components/InputFloatingLabel";
import textura from "../assets/img/textura.png";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTools } from "react-icons/fa";
import "../App.css";
import { verificarEmail, enviarCodigoRecuperacion } from "../api/empresa";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Verificar si el email existe
      await verificarEmail(email);
      // Enviar el código de recuperación
      await enviarCodigoRecuperacion(email);
      navigate("/codigo-verificacion", { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `url(${textura}) center/cover no-repeat` }}>
      <div className="card" style={{ maxWidth: 400, width: "100%", background: "var(--color-card)", boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: 18, padding: "2.5rem 2rem" }}>
        <h2 style={{ color: "var(--color-gold)", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Recuperar contraseña</h2>
        <p style={{ color: "var(--color-white)", fontSize: "1.1rem", marginBottom: 24, textAlign: "center" }}>
          Podemos ayudarte a restablecer tu contraseña.<br />
          Primero escribe tu correo con el que te registraste y sigue las instrucciones.
        </p>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: 12 }}>
          <InputFloatingLabel
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
          />
          <button className="button-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Verificando..." : "Siguiente"}
          </button>
          {error && <div style={{ color: "#ff5252", marginTop: 10, fontWeight: 500 }}>{error}</div>}
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
          <Link to="/" style={{ color: "var(--color-gold)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <FaArrowLeft /> Volver al inicio
          </Link>
          <a href="mailto:soporte@multiempresas.com" target="_blank" style={{ color: "var(--color-gold)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <FaTools /> Soporte técnico
          </a>
        </div>
      </div>
    </div>
  );
}
