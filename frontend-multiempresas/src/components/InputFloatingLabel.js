// InputFloatingLabel.js
import React, { useState } from "react";
import "../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

export default function InputFloatingLabel({
  label,
  type = "text",
  name,
  value,
  onChange,
  // Nueva prop para habilitar el ojito
  showPasswordToggle = false, 
  ...props
}) {
  // Estado para controlar si la contraseña se muestra o se oculta
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determinar el tipo de input real: 'text' o 'password'
  // Solo se aplica si showPasswordToggle es true y el tipo original es 'password'
  let effectiveType = type;
  if (showPasswordToggle && type === 'password') {
    effectiveType = showPassword ? 'text' : 'password';
  }

  return (
    // Contenedor principal con posición relativa para posicionar el label y el ícono
    <div className={`floating-label-group${isFocused || hasValue ? " focused" : ""}`} style={{ position: "relative", marginBottom: "1.5rem" }}>
      <input
        className="input"
        type={effectiveType} // Usamos el tipo dinámico aquí
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        style={{ width: "100%", paddingRight: showPasswordToggle && type === 'password' ? '2.5rem' : '1rem' }} // Añadir padding si hay ícono
        {...props}
      />
      <label
        htmlFor={name}
        style={{
          position: "absolute",
          left: 6,
          top: isFocused || hasValue ? 0 : "40%",
          fontSize: isFocused || hasValue ? 14 : 16,
          color: isFocused ? "var(--color-gold)" : "#aaa",
          background: "var(--color-card)",
          padding: "0 12px",
          pointerEvents: "none",
          transform: isFocused || hasValue ? "translateY(-60%) scale(0.95)" : "translateY(-50%)",
          transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
          zIndex: 2, // Asegura que el label esté sobre el input pero debajo del ícono
        }}
      >
        {label}
      </label>

      {/* Ícono de ojito, solo si showPasswordToggle es true y el tipo original es 'password' */}
      {showPasswordToggle && type === 'password' && (
        <span 
          onClick={togglePasswordVisibility}
          // Estilos para posicionar el ícono
          style={{
            position: 'absolute',
            right: '1rem', // Distancia desde la derecha
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: 'var(--color-input-border)', // Color del ícono
            zIndex: 3, // Asegura que el ícono esté por encima del input y el label
            fontSize: '1.2rem', // Tamaño del ícono
            display: 'flex', // Para centrar el ícono si usas Font Awesome o SVGs
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Aquí puedes usar un emoji para probar, o un ícono de una librería */}
          {/* {showPassword ? '🕶️' : '👀'}  */}
          {/* Ejemplo con Font Awesome: */}
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> 
        </span>
      )}
    </div>
  );
}
