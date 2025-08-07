import React, { useState } from "react";
import { registrarEmpresa } from "../api/empresa";
import textura from "../assets/img/textura.png";
import logoEmpresa from "../assets/img/logo-empresa3.png";

export default function RegistroEmpresa() {
  const [form, setForm] = useState({
    nombre_empresa: "",
    direccion: "",
    telefono: "",
    email: "",
    username: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registrarEmpresa(form);
    setMensaje(res.mensaje || JSON.stringify(res));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${textura}) center/cover no-repeat`,
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: "100%",
          background: "var(--color-card)",
          boxShadow: "0 6px 36px rgba(0,0,0,0.22)",
          borderRadius: 22,
          padding: "2.8rem 2.2rem",
          position: "relative",
        }}
      >
        <img
          src={logoEmpresa}
          alt="Logo"
          style={{
            width: 70,
            position: "absolute",
            top: -35,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            boxShadow: "0 2px 12px #FFD700",
          }}
        />
        <h2
          style={{
            color: "var(--color-gold)",
            fontWeight: 800,
            marginBottom: 12,
            textAlign: "center",
            fontSize: "2rem",
            letterSpacing: 1,
          }}
        >
          Registro de Empresa
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <input
            name="nombre_empresa"
            placeholder="Nombre de la empresa"
            onChange={handleChange}
            required
            className="input"
            style={{ fontWeight: 600, fontSize: 16 }}
          />
          <input
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
            className="input"
            style={{ fontWeight: 500 }}
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            className="input"
            style={{ fontWeight: 500 }}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
            className="input"
            style={{ fontWeight: 600 }}
          />
          <input
            name="username"
            placeholder="Usuario administrador"
            onChange={handleChange}
            required
            className="input"
            style={{ fontWeight: 600 }}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="input"
            style={{ fontWeight: 600 }}
          />
          <button
            type="submit"
            className="button-primary"
            style={{
              width: "100%",
              marginTop: 10,
              fontSize: 18,
              fontWeight: 700,
              background: "var(--color-gold)",
              color: "#222",
              borderRadius: 8,
              boxShadow: "0 2px 8px #FFD700",
            }}
          >
            Registrar empresa
          </button>
          {mensaje && (
            <div
              style={{
                color: "#FFD700",
                marginTop: 10,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}