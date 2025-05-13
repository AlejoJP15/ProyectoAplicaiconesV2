import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MenuAdmin() {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("id_sesion");

  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch("http://localhost:5000/estadisticas", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las estadísticas");
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);
        setEstadisticas(data);
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError("No se pudieron cargar las estadísticas");
      }
    };

    fetchEstadisticas();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_sesion: sessionId }),
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
          <div onClick={() => navigate("/")}>Administrador</div>
          <ul>
            <li onClick={() => navigate("/admin/gestion_usuario_admin")}>
              Gestionar Usuarios
            </li>
            <li onClick={() => navigate("/admin/visualizar_estadisticas_admin")}>
              Visualizar Estadísticas
            </li>
            <li onClick={handleLogout}>Cerrar Sesión</li>
          </ul>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div>
        <h2>Dashboard del Administrador</h2>
        {/* Aquí puedes añadir más lógica para mostrar las estadísticas si están disponibles */}
        {error && <div>{error}</div>}
        {estadisticas && (
          <div>
            <h3>Estadísticas</h3>
            <pre>{JSON.stringify(estadisticas, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuAdmin;
