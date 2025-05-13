import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => /^[^@]+@[^@]+\.[^@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setIsLoading(false);
      return;
    }

    if (!isEmailValid(email)) {
      setError("Por favor ingresa un correo válido");
      setIsLoading(false);
      return;
    }

    try {
      const dispositivo = navigator.userAgent;
      const canal = "web";

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, dispositivo, canal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error desconocido al iniciar sesión");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // Guardar en localStorage
        localStorage.setItem("id_sesion", data.id_sesion);
        localStorage.setItem("nombre_usuario", data.nombre);
        localStorage.setItem("role", data.rol);

        // 1) Notificar a App que se actualice el estado de autenticación
        onLoginSuccess();

        // 2) Redirigir a la ruta protegida
        navigate("/menu_usuario");
      } else {
        setError(data.message || "Error: credenciales inválidas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Alerta de error */}
      {error && <div>{error}</div>}

      {/* Formulario de inicio de sesión */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Enlaces */}
      <div>
        <button onClick={() => navigate("/register")}>
          ¿Primera vez? Regístrate
        </button>
        <a href="/forgot-password">¿Olvidó su contraseña?</a>
      </div>
    </div>
  );
}

export default Login;
