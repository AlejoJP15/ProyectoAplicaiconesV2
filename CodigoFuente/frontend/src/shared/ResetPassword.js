import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/login.css";  //Usa el mismo CSS que `Register.js`

function ResetPassword() {
  const { token } = useParams();  // Obtener token de la URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const validatePassword = (password) => {
    if (password.length < 8) return "Debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Debe contener al menos una letra mayúscula.";
    if (!/[a-z]/.test(password)) return "Debe contener al menos una letra minúscula.";
    if (!/\d/.test(password)) return "Debe contener al menos un número.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Debe contener al menos un carácter especial.";
    return null;
  };

  //Enviar nueva contraseña al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error al cambiar la contraseña.");
        setIsLoading(false);
        return;
      }

      setSuccess("Contraseña cambiada exitosamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError("Error en la conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">  {/*Usa el mismo estilo de Register.js */}
      <div className="register-left">
        <h1>Recuperar Contraseña</h1>
        <p>Ingresa una nueva contraseña segura.</p>
        <img src="/LogoC.png" alt="Logo" className="register-logo" />
      </div>

      <div className="register-right">
        <div className="register-box">
          <h2 className="register-title">Nueva Contraseña</h2>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="password"
              placeholder="Nueva contraseña"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="register-input"
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="register-input"
              required
            />
            <button
              type="submit"
              className={`register-button ${isLoading ? "button-loading" : "button-active"}`}
              disabled={isLoading}
            >
              {isLoading ? "Cambiando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
