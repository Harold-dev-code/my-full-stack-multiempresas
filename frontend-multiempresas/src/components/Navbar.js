import React from "react";
import { useNavigate } from "react-router-dom";
import logoEmpresa from "../assets/img/logo-empresa3.png";
import { getAccessToken, clearTokens } from "../api/auth";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    clearTokens();
    navigate("/login", { replace: true });
  };
  return (
    <nav style={{
      width: "100%",
      background: "var(--color-card, #222)",
      color: "var(--color-gold, #FFD700)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.7rem 2rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={logoEmpresa} alt="Logo" style={{ width: 38, borderRadius: "50%" }} />
        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>Multiempresas</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {user && <span style={{ fontWeight: 600, fontSize: 16 }}>{user.username}</span>}
        <button onClick={handleLogout} style={{ background: "var(--color-gold, #FFD700)", color: "#222", border: "none", borderRadius: 6, padding: "0.5rem 1rem", fontWeight: 700, cursor: "pointer" }}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
