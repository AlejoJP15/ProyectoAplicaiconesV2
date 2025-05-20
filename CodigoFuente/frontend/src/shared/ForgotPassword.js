import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || "Revisa tu correo para continuar.");
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Sección izquierda con el logo y mensaje */}
      <div className="login-left">
        <div className="welcome-message">
          <h1>Recuperación de Contraseña</h1>
        </div>
        <img src="/LogoC.png" alt="Logo" className="login-logo" />
        <p className="login-slogan">
          "Recupera tu acceso de manera segura"
        </p>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="login-right">
        <div className="login-box">
          <h2 className="login-title">Recuperar Contraseña</h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Correo Electrónico"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="login-input"
              required
            />
            <button
              type="submit"
              className={`login-button ${
                isLoading ? "button-loading" : "button-active"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Correo"}
            </button>
          </form>

          <div className="login-links">
            <button onClick={() => navigate("/login")} className="link">
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
