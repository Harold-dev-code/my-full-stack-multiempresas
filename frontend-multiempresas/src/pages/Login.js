// Login.js
import React, { useState } from "react";
import { login, setTokens } from "../api/auth";
import { useNavigate } from "react-router-dom";
import logoEmpresa from "../assets/img/logo-empresa3.png";
import textura from "../assets/img/textura.png";
import "../App.css"; // ¡Asegúrate de que este import está presente!
import InputFloatingLabel from "../components/InputFloatingLabel"; // Asegúrate de que esta ruta sea correcta

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      if (res.access) {
        setTokens(res.access, res.refresh);
        // Aquí podrías añadir lógica para guardar las credenciales si rememberMe es true
        navigate("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      setError("Credenciales incorrectas o usuario inactivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
      {/* Contenedor principal ahora usa la clase CSS para responsividad */}
      <div className="login-card-container"> {/* Clase CSS */}
        {/* Panel de la imagen de textura, ahora usa la clase CSS */}
        <div 
          className="login-texture-panel" // Clase CSS
          style={{ background: `url(${textura}) center/cover no-repeat` }} 
        />
        
        {/* Panel del formulario, ahora usa la clase CSS */}
        <div className="login-form-panel"> {/* Clase CSS */}
          <img src={logoEmpresa} alt="Logo" className="logo-empresa" style={{ width: 70, height: 70, borderRadius: "50%", marginBottom: 24, boxShadow: "0 2px 12px rgba(255,215,0,0.10)", background: "var(--color-card)" }} />
          <h2 style={{ color: "var(--color-gold)", fontWeight: 700, marginBottom: 8 }}>Iniciar sesión</h2>
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
            <br></br>
           
            <InputFloatingLabel
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoFocus
            />
            <InputFloatingLabel
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              showPasswordToggle={true} // ¡Aquí se habilita el ojito para este input!
            />
            
            {/* Contenedor para "Recordar credenciales" y "¿Has olvidado...?" */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                width: "100%", 
                marginTop: 8 
            }}>
                <label style={{ display: "flex", alignItems: "center", color: "var(--color-white)", fontSize: 14 }}>
                    <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={handleRememberMeChange} 
                        style={{ marginRight: 8, accentColor: 'var(--color-gold)' }} 
                    />
                    Recordar credenciales
                </label>

                <a href= "/recuperar-contrasena" style={{ textDecoration: "none", color: "var(--color-gold)", fontSize: 14 }}>
                    ¿Has olvidado tu contraseña?
                </a>
            </div>

            <button className="button-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            {error && <div style={{ color: "#ff5252", marginTop: 8, fontWeight: 500 }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
