import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu_usuario.css"; // Usa los estilos que ya funcionan

const MenuSuperiorAdmin = () => {
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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          Administrador
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item" onClick={() => navigate("/admin/gestion_usuario_admin")}>
            Gestionar Usuarios
          </li>
          <li className="navbar-item" onClick={() => navigate("/admin/visualizar_estadisticas_admin")}>
            Visualizar Estadísticas
          </li>
          <li className="navbar-item logout" onClick={handleLogout}>
            Cerrar Sesión
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuSuperiorAdmin;
