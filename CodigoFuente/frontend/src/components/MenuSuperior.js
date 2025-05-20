import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaUser, FaSignOutAlt,  FaRegGrinBeam } from "react-icons/fa";
import "../styles/navbar.css"; // ajusta la ruta según tu proyecto

const MenuSuperior = () => {
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
          Pagina de inicio
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item" onClick={() => navigate("/mis-interacciones")}>
            <FaComments /> Mis Interacciones
          </li>
          <li className="navbar-item" onClick={() => navigate("/camera-stream")}>
            < FaRegGrinBeam/> Acceder al reconocimiento emocional
          </li>
          <li className="navbar-item" onClick={() => navigate("/user/ActualizaUser")}>
            <FaUser /> Mi Cuenta
          </li>
          <li className="navbar-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuSuperior;