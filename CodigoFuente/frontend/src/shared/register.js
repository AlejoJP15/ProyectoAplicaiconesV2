import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = `${name} ${lastName}`.trim();

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalVisible(true); // Mostrar el modal
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      console.error("Error al registrarse:", err);
      setError("Error al conectarse al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-green-600 mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-700 mb-6">
              Tu cuenta ha sido creada exitosamente.
            </p>
            <button
              onClick={closeModal}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <div className="register-wrapper">
        <img src="/LogoC.png" alt="Logo" className="register-logo" />
        <div className="register-form-container">
          <h2 className="register-title">Registrarse</h2>

          {/* Alerta de Error */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} className="register-form">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
            <button
              type="submit"
              className={`register-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Registrarse"}
            </button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="back-to-login-button"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;



