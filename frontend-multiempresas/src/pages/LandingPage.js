import React from "react";
import "../App.css";
import logoEmpresa from "../assets/img/logo-empresa3.png";

export default function LandingPage() {
  return (
    <section className="hero-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
        <img
          src={logoEmpresa}
          alt="Logo empresa"
          className="logo-empresa"
          style={{ width: 150, height: 150, borderRadius: '50%', boxShadow: '0 4px 24px rgba(255,215,0,0.15)', background: 'var(--color-card)' }}
        />
        <h1 style={{ fontSize: '2.8rem', color: 'var(--color-gold)', fontWeight: 800, margin: 0 }}>
          Bienvenido a Multiempresas
        </h1>
        <p style={{ color: 'var(--color-white)', fontSize: '1.3rem', maxWidth: 500, margin: '0 auto' }}>
          Gestiona tu empresa  y usuarios con una experiencia moderna, rápida y segura.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" className="button-primary" style={{ textDecoration: 'none' }}>
            Iniciar sesión
          </a>
          <a href="/registro" className="button-primary" style={{ textDecoration: 'none', background: 'linear-gradient(90deg, var(--color-gold-soft), var(--color-gold))' }}>
            Registrar empresa
          </a>
                  </div>
      </div>
    </section>
  );
}