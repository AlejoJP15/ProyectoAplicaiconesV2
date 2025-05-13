import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        alert("¡Registro Exitoso!"); // Mostrar mensaje de éxito
        navigate("/login");
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

  return (
    <div>
      {/* Alerta de Error */}
      {error && <div>{error}</div>}

      {/* Formulario */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Registrarse"}
        </button>
      </form>

      <button onClick={() => navigate("/login")}>
        Volver al Login
      </button>
    </div>
  );
}

export default Register;
