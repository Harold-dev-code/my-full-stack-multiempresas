import React, { useEffect, useState } from "react";
import { getAccessToken } from "../api/auth";
import { estadoSuscripcion } from "../api/empresa";

export default function EstadoSuscripcion() {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    async function fetchEstado() {
      const token = getAccessToken();
      const res = await estadoSuscripcion(token);
      if (res) setEstado(res);
      // Si res es null, no mostrar error ni actualizar estado
    }
    fetchEstado();
  }, []);

  return (
    <div>
      <h2>Estado de Suscripción</h2>
      {estado && (
        <div>
          <p>Empresa: {estado.empresa}</p>
          <p>Suscripción activa: {estado.suscripcion_activa ? "Sí" : "No"}</p>
        </div>
      )}
    </div>
  );
}