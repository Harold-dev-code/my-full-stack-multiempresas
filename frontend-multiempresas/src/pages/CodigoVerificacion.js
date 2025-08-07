import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verificarCodigoOTP } from "../api/empresa";
import textura from "../assets/img/textura.png";
import "../App.css";


export default function CodigoVerificacion() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  // Recupera el email desde la navegación previa (RecuperarContrasena)
  const { email } = location.state || {};

  // Mostrar los dígitos a medida que se ingresan
  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError("");
    // Focus next input
    if (value && idx < 5) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const code = otp.join("");
    if (!email) {
      setError("No se encontró el email. Vuelve a recuperar contraseña.");
      setLoading(false);
      return;
    }
    try {
      await verificarCodigoOTP(email, code);
      // Navega a la pantalla de nueva contraseña, pasando email y código
      navigate("/nueva-contrasena", { state: { email, codigo: code } });
    } catch (err) {
      setError(err.message || "El código ingresado es incorrecto o expiró.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `url(${textura}) center/cover no-repeat` }}>
      <div className="card" style={{ maxWidth: 400, width: "100%", background: "var(--color-card)", boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: 18, padding: "2.5rem 2rem" }}>
        <h2 style={{ color: "var(--color-gold)", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Verificación OTP</h2>
        <p style={{ color: "var(--color-white)", fontSize: "1.1rem", marginBottom: 24, textAlign: "center" }}>
          Te hemos enviado el código OTP por el correo electrónico.<br />
          Ingresa el código en la columna a continuación.
        </p>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="otp-input"
                style={{
                  background: digit ? '#fffbe6' : '#fff',
                  color: '#222',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 28,
                  border: '2.5px solid #222',
                  borderRadius: 8,
                  textAlign: 'center',
                  boxShadow: '0 0 0 1.5px #222',
                  outline: 'none',
                  width: 40,
                  height: 48,
                  margin: '0 2px',
                  letterSpacing: 2
                }}
                required
              />
            ))}
          </div>
          <button className="button-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? "Verificando..." : "Siguiente"}
          </button>
          {error && <div style={{ color: "#ff5252", marginTop: 10, fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
