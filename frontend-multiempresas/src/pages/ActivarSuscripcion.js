import React, { useState } from "react";
import { getAccessToken } from "../api/auth";
import { activarSuscripcion } from "../api/empresa";

export default function ActivarSuscripcion() {
  const [mensaje, setMensaje] = useState("");

  const handleActivar = async () => {
    const token = getAccessToken();
    const res = await activarSuscripcion(token);
    setMensaje(res.mensaje || JSON.stringify(res));
  };

  return (
    <div>
      <h2>Activar Suscripción</h2>
      <button onClick={handleActivar}>Activar</button>
      <div>{mensaje}</div>
    </div>
  );
}