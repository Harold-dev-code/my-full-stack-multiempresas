import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearTokens } from "../api/auth";
import { estadoSuscripcion } from "../api/empresa";
import "./Dashboard.css";
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
  const navigate = useNavigate();
  const [estado, setEstado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const usersPerPage = 5;

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

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = usuarios.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const token = getAccessToken();
        await fetch(`http://localhost:8000/api/usuarios/${userId}/`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        // Actualizar la lista de usuarios
        const listaUsuarios = await obtenerUsuariosEmpresa(token);
        setUsuarios(listaUsuarios);
        setMensaje("Usuario eliminado correctamente");
      } catch (err) {
        setMensaje("Error al eliminar el usuario: " + err.message);
      }
    }
  };

  return (
    <>
      <Navbar user={usuario} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Panel de Control</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Usuario
          </button>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Usuarios</h4>
            <div className="stat-value">{usuarios.length}</div>
          </div>
          <div 
            className="stat-card stat-card-clickable"
            onClick={() => navigate('/estado-suscripcion')}
            style={{ cursor: 'pointer' }}
          >
            <h4>Estado Suscripción</h4>
            <div className="stat-value">
              {estado?.suscripcion_activa ? (
                <>
                  <span style={{ color: '#2ed573' }}>Activa</span>
                  <div className="stat-subtext">Click para ver detalles</div>
                </>
              ) : (
                <>
                  <span style={{ color: '#ff4757' }}>Inactiva</span>
                  <div className="stat-subtext">Click para activar plan</div>
                </>
              )}
            </div>
          </div>
          <div className="stat-card">
            <h4>Empresa</h4>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>
              {estado?.empresa}
            </div>
          </div>
        </div>
        
        {/* Banner de suscripción si no está activa */}
        {estado && !estado.suscripcion_activa && (
          <div className="subscription-banner">
            <div className="subscription-banner-content">
              <div className="subscription-text">
                <h3>¡Activa tu suscripción!</h3>
                <p>Desbloquea todas las funcionalidades activando un plan de suscripción.</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/estado-suscripcion')}
              >
                Ver Planes Disponibles
              </button>
            </div>
          </div>
        )}

        {/* Sección de Usuarios */}
        <div className="users-section">
          <div className="users-header">
            <h3>Gestión de Usuarios</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ color: user.is_active ? '#4cd964' : '#ff3b30' }}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEditUser(user)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Modal para crear/editar usuario */}
        {showModal && (
          <div className="form-overlay">
            <div className="form-modal">
              <div className="form-header">
                <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setNuevoUsuario({ username: "", email: "", password: "" });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCrearUsuario}>
                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    name="username"
                    value={nuevoUsuario.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={nuevoUsuario.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input
                      name="password"
                      type="password"
                      value={nuevoUsuario.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                      setNuevoUsuario({ username: "", email: "", password: "" });
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
              {mensaje && <div className="form-message">{mensaje}</div>}
            </div>
          </div>
        )}

        {/* Nueva sección de Información de Empresa y Análisis */}
        <div className="dashboard-sections">
          <div className="dashboard-section-left">
            {/* Información de la Empresa */}
            <div className="info-panel">
              <div className="panel-header">
                <h3>Información de la Empresa</h3>
                <button className="btn btn-secondary btn-sm">
                  <i className="fas fa-edit"></i> Editar
                </button>
              </div>
              <div className="company-details">
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{estado?.empresa}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Plan Actual:</span>
                  <span className="detail-value">Plan Profesional</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de Registro:</span>
                  <span className="detail-value">01/08/2025</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estado:</span>
                  <span className="detail-value status-active">Activo</span>
                </div>
              </div>
            </div>

            {/* Gráficas y Estadísticas */}
            <div className="info-panel">
              <div className="panel-header">
                <h3>Estadísticas</h3>
                <div className="panel-actions">
                  <select className="select-period">
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                    <option value="year">Este año</option>
                  </select>
                </div>
              </div>
              <div className="charts-grid">
                <div className="chart-container">
                  <h4>Actividad de Usuarios</h4>
                  <div className="chart-placeholder">
                    {/* Aquí irá el gráfico de actividad */}
                    <div className="placeholder-text">Gráfico de Actividad</div>
                  </div>
                </div>
                <div className="chart-container">
                  <h4>Uso de Recursos</h4>
                  <div className="chart-placeholder">
                    {/* Aquí irá el gráfico de recursos */}
                    <div className="placeholder-text">Gráfico de Recursos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section-right">
            {/* Actividades Recientes */}
            <div className="info-panel">
              <div className="panel-header">
                <h3>Actividades Recientes</h3>
                <button className="btn btn-secondary btn-sm">Ver todas</button>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon user-icon">👤</div>
                  <div className="activity-content">
                    <p>Nuevo usuario registrado</p>
                    <span className="activity-time">Hace 2 horas</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon update-icon">🔄</div>
                  <div className="activity-content">
                    <p>Actualización de suscripción</p>
                    <span className="activity-time">Hace 1 día</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon settings-icon">⚙️</div>
                  <div className="activity-content">
                    <p>Cambios en la configuración</p>
                    <span className="activity-time">Hace 2 días</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Noticias y Actualizaciones */}
            <div className="info-panel">
              <div className="panel-header">
                <h3>Noticias y Actualizaciones</h3>
              </div>
              <div className="news-list">
                <div className="news-item">
                  <h4>Nueva Función: Gráficos Avanzados</h4>
                  <p>Ahora puedes visualizar tus datos con gráficos interactivos y personalizables.</p>
                  <span className="news-date">05/08/2025</span>
                </div>
                <div className="news-item">
                  <h4>Próximamente: Integración con API</h4>
                  <p>Estamos trabajando en nuevas integraciones para mejorar tu experiencia.</p>
                  <span className="news-date">03/08/2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}