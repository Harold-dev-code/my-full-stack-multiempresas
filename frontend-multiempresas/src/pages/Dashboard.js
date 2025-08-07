import React, { useEffect, useState } from "react";
import { getAccessToken, clearTokens } from "../api/auth";
import { estadoSuscripcion } from "../api/empresa";
import "../App.css"; // Asegúrate de que la ruta sea correcta
import Navbar from "../components/Navbar";
import jwt_decode from "../utils/jwt";

// Placeholder para obtener info del usuario logueado (puedes reemplazarlo por un endpoint real)
function getUsuarioActual() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwt_decode(token);
    return { username: decoded.username, email: decoded.email };
  } catch {
    return null;
  }
}

// Reemplaza los placeholders por funciones reales conectadas a la API

async function obtenerUsuariosEmpresa(token) {
  const response = await fetch("http://localhost:8000/api/usuarios/", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.json();
}

async function crearUsuarioEmpresa(token, data) {
  const response = await fetch("http://localhost:8000/api/usuarios/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.detail || JSON.stringify(resData));
  }
  return resData;
}

export default function Dashboard() {
  const [estado, setEstado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    async function fetchData() {
      const resEstado = await estadoSuscripcion(token);
      if (resEstado) setEstado(resEstado);
      setUsuario(getUsuarioActual());
      const listaUsuarios = await obtenerUsuariosEmpresa(token);
      setUsuarios(listaUsuarios);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "¿Desea salir y cerrar la sesión?";
      return "¿Desea salir y cerrar la sesión?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (window.location.pathname === "/dashboard") {
        const confirmLogout = window.confirm("¿Desea salir y cerrar la sesión?");
        if (confirmLogout) {
          clearTokens();
          window.location.href = "/login";
        } else {
          window.history.pushState(null, null, window.location.pathname);
        }
      }
    };
    window.history.pushState(null, null, window.location.pathname); // Prevenir retroceso inmediato
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");
    const token = getAccessToken();
    try {
      await crearUsuarioEmpresa(token, nuevoUsuario);
      setMensaje("Usuario creado correctamente.");
      // Recarga la lista de usuarios desde la API real
      const listaUsuarios = await obtenerUsuariosEmpresa(token);
      setUsuarios(listaUsuarios);
      setNuevoUsuario({ username: "", email: "", password: "" });
    } catch (err) {
      setMensaje("Error: " + err.message);
    }
  };

  return (
    <>
      <Navbar user={usuario} />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>
        {/* Info de empresa y suscripción */}
        {estado && (
          <div className="dashboard-section">
            <p><b>Empresa:</b> {estado.empresa}</p>
            <p><b>Suscripción activa:</b> {estado.suscripcion_activa ? "Sí" : "No"}</p>
          </div>
        )}
        {/* Info del usuario logueado */}
        {usuario && (
          <div className="dashboard-section">
            <h3>Usuario actual</h3>
            <p><b>Usuario:</b> {usuario.username}</p>
            <p><b>Email:</b> {usuario.email}</p>
          </div>
        )}
        {/* Lista de usuarios de la empresa */}
        <div className="dashboard-section">
          <h3>Usuarios de la empresa</h3>
          <ul className="dashboard-list">
            {usuarios.map((u) => (
              <li key={u.id}>{u.username} ({u.email})</li>
            ))}
          </ul>
        </div>
        {/* Formulario para crear usuario */}
        <div className="dashboard-section">
          <h3>Agregar usuario</h3>
          <form className="dashboard-form" onSubmit={handleCrearUsuario}>
            <input name="username" placeholder="Usuario" value={nuevoUsuario.username} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={nuevoUsuario.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={handleChange} required />
            <button type="submit">Crear usuario</button>
          </form>
          {mensaje && <div className="dashboard-message">{mensaje}</div>}
        </div>
      </div>
    </>
  );
}