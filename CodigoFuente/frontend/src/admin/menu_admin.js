import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { FaChartLine, FaUsers, FaChartPie, FaSmile } from "react-icons/fa";
import MenuSuperiorAdmin from "../components/MenuSuperiorAdmin";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

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

  // Datos para el gráfico de pastel (porcentajes de emociones)
  const dataPieEmociones = estadisticas && Array.isArray(estadisticas.porcentaje_emociones) && estadisticas.porcentaje_emociones.length > 0 ? {
    labels: estadisticas.porcentaje_emociones.map((item) => item.emocion),
    datasets: [
      {
        label: "Porcentaje de Emociones",
        data: estadisticas.porcentaje_emociones.map((item) => item.porcentaje),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        hoverOffset: 4,
      },
    ],
  } : null;

  // Datos para el gráfico de pastel (distribución de emociones)
  const dataPie = estadisticas && Array.isArray(estadisticas.distribucion_emociones) && estadisticas.distribucion_emociones.length > 0 ? {
    labels: estadisticas.distribucion_emociones.map((item) => item.emocion),
    datasets: [
      {
        label: "Frecuencia de Emociones",
        data: estadisticas.distribucion_emociones.map((item) => item.frecuencia),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        hoverOffset: 4,
      },
    ],
  } : null;

  // Datos para el gráfico de pastel (porcentajes de usuarios por emoción)
  const dataPieUsuarios = estadisticas && Array.isArray(estadisticas.porcentaje_usuarios_por_emocion) && estadisticas.porcentaje_usuarios_por_emocion.length > 0 ? {
    labels: estadisticas.porcentaje_usuarios_por_emocion.map((item) => item.emocion),
    datasets: [
      {
        label: "Porcentaje de Usuarios",
        data: estadisticas.porcentaje_usuarios_por_emocion.map((item) => item.porcentaje),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        hoverOffset: 4,
      },
    ],
  } : null;

  // Datos para el gráfico de líneas (tendencias emocionales)
  const dataLine = estadisticas && Array.isArray(estadisticas.tendencias_emocionales) && estadisticas.tendencias_emocionales.length > 0 ? {
    labels: [...new Set(estadisticas.tendencias_emocionales.map((item) => item.fecha))], // Fechas únicas
    datasets: [
      {
        label: "Frecuencia de Emociones",
        data: estadisticas.tendencias_emocionales.map((item) => item.frecuencia),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  } : null;

  return (
    <div className="bg-gray-100 min-h-screen">
      <MenuSuperiorAdmin />  {/* Aquí se usa el menú reutilizable */}
      <div className="contenido-pagina">
        {/* Contenido de la página */}
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard del Administrador</h2>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded shadow">{error}</p>}
        {estadisticas ? (
          <>
            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white shadow-md p-6 rounded-lg flex items-center space-x-4">
                <FaChartLine className="text-blue-600 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold">Total de Sesiones</h3>
                  <p className="text-2xl font-bold">{estadisticas.total_sesiones}</p>
                </div>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg flex items-center space-x-4">
                <FaUsers className="text-green-600 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold">Usuarios Registrados</h3>
                  <p className="text-2xl font-bold">{estadisticas.total_usuarios}</p>
                </div>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg flex items-center space-x-4">
                <FaSmile className="text-yellow-600 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold">Emoción Predominante</h3>
                  <p className="text-2xl font-bold">{estadisticas.emocion_predominante}</p>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Gráfico de Pastel (Emociones) */}
              <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Distribución de Emociones</h3>
                <div className="w-full h-[400px] flex justify-center">
                  {dataPie ? (
                    <Pie data={dataPie} options={{ responsive: true, maintainAspectRatio: false }} />
                  ) : (
                    <p className="text-gray-500">No hay datos disponibles para el gráfico de pastel.</p>
                  )}
                </div>
              </div>

              {/* Gráfico de Líneas */}
              <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Tendencias Emocionales</h3>
                <div className="w-full h-[400px] flex justify-center">
                  {dataLine ? (
                    <Line data={dataLine} options={{ responsive: true, maintainAspectRatio: false }} />
                  ) : (
                    <p className="text-gray-500">No hay datos disponibles para el gráfico de líneas.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          !error && <p className="text-gray-500">Cargando estadísticas...</p>
        )}
      </div>
    </div>
  );
}

export default MenuAdmin;