import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import RegistroEmpresa from "./pages/RegistroEmpresa";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EstadoSuscripcion from "./pages/EstadoSuscripcion";
import ActivarSuscripcion from "./pages/ActivarSuscripcion";
import ProtectedRoute from "./components/ProtectedRoute";
import RecuperarContrasena from "./pages/RecuperarContrasena";
import CodigoVerificacion from "./pages/CodigoVerificacion";
import NuevaContrasena from "./pages/NuevaContrasena";
function App() {
  // Rutas donde NO se debe mostrar el Navbar
  const hideNavbarRoutes = ["/", "/login", "/registro", "/recuperar-contrasena", "/codigo-verificacion", "/nueva-contrasena"];
  const currentPath = window.location.pathname;
  const showNavbar = !hideNavbarRoutes.includes(currentPath);
  return (
    <BrowserRouter>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegistroEmpresa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/codigo-verificacion" element={<CodigoVerificacion />} />
        <Route path="/nueva-contrasena" element={<NuevaContrasena />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/estado-suscripcion" element={
          <ProtectedRoute>
            <EstadoSuscripcion />
          </ProtectedRoute>
        } />
        <Route path="/activar-suscripcion" element={
          <ProtectedRoute>
            <ActivarSuscripcion />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;