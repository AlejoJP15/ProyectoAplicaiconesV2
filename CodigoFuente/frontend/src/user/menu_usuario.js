import React from "react";
import { useNavigate } from "react-router-dom";

function MenuUsuario() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_sesion: localStorage.getItem("id_sesion") }),
      });
      localStorage.removeItem("id_sesion");
      localStorage.removeItem("nombre_usuario");
      localStorage.removeItem("role");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div>
      {/* Menú de navegación simplificado */}
      <nav>
        <div>
          <div onClick={() => navigate("/")}>Mi Proyecto AI</div>
          <ul>
            <li onClick={() => navigate("/mis-interacciones")}>Mis Interacciones</li>
            <li onClick={() => navigate("/user/ActualizaUser")}>Mi Cuenta</li>
            <li onClick={handleLogout}>Cerrar Sesión</li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default MenuUsuario;




