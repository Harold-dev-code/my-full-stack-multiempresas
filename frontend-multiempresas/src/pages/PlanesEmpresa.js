import React, { useState } from 'react';
import { activarSuscripcion } from '../api/empresa';
import './PlanesEmpresa.css';

const planes = [
  {
    nombre: 'Básico',
    precio: '$10/mes',
    descripcion: 'Gestión de usuarios y empresas, soporte básico.'
  },
  {
    nombre: 'Pro',
    precio: '$25/mes',
    descripcion: 'Incluye reportes, roles avanzados y soporte prioritario.'
  },
  {
    nombre: 'Premium',
    precio: '$50/mes',
    descripcion: 'Todas las funciones, auditoría y soporte dedicado.'
  }
];

function PlanesEmpresa() {
  const [activando, setActivando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleActivar = async (plan) => {
    setActivando(true);
    setMensaje('');
    try {
      // Aquí se puede enviar el plan seleccionado al backend
      await activarSuscripcion(plan.nombre);
      setMensaje('¡Suscripción activada correctamente!');
    } catch (error) {
      setMensaje('Error al activar la suscripción.');
    }
    setActivando(false);
  };

  return (
    <div className="planes-empresa-container">
      <h2>Planes de Suscripción</h2>
      <div className="planes-list">
        {planes.map((plan) => (
          <div key={plan.nombre} className="plan-card">
            <h3>{plan.nombre}</h3>
            <p>{plan.precio}</p>
            <p>{plan.descripcion}</p>
            <button onClick={() => handleActivar(plan)} disabled={activando}>
              Activar este plan
            </button>
          </div>
        ))}
      </div>
      {mensaje && <div className="mensaje-activacion">{mensaje}</div>}
    </div>
  );
}

export default PlanesEmpresa;
