import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { FaChartLine, FaUsers, FaSmile,
  FaFrown,
  FaAngry,
  FaMeh,
  FaSurprise,
  FaTired,
  FaGrinSquint } from "react-icons/fa";

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
import '../styles/menu_admin.css';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const iconoEmocion = {
  feliz: <FaSmile className="text-yellow-500 text-4xl" />,
  triste: <FaFrown className="text-blue-500 text-4xl" />,
  enojado: <FaAngry className="text-red-500 text-4xl" />,
  neutro: <FaMeh className="text-gray-500 text-4xl" />,
  sorprendido: <FaSurprise className="text-purple-500 text-4xl" />,
  temeroso: <FaTired className="text-indigo-500 text-4xl" />,
  disgustado: <FaGrinSquint className="text-pink-500 text-4xl" />
};
// Diccionario de traducción de emociones
const traducciones = {
  happy: "feliz",
  sad: "triste",
  angry: "enojado",
  neutral: "neutro",
  surprised: "sorprendido",
  fearful: "temeroso",
  disgusted: "disgustado",
  feliz: "feliz",
  triste: "triste",
  enojado: "enojado",
  sorprendido: "sorprendido",
  neutro: "neutro"
};

const traducir = (emocion) => {
  return traducciones[emocion.toLowerCase()] || emocion;
};

// Agrupar emociones por su versión traducida y sumar frecuencia
const agruparEmociones = (emociones) => {
  const agrupadas = {};

  emociones.forEach((item) => {
    const emocionTraducida = traducir(item.emocion);
    if (!agrupadas[emocionTraducida]) {
      agrupadas[emocionTraducida] = 0;
    }
    agrupadas[emocionTraducida] += item.frecuencia;
  });

  return Object.entries(agrupadas).map(([emocion, frecuencia]) => ({
    emocion,
    frecuencia
  }));
};

// Agrupar frecuencias por fecha sumando todas las emociones del mismo día
const agruparFrecuenciasPorFecha = (datos) => {
  const acumulador = {};

  datos.forEach((item) => {
    const fecha = item.fecha;
    const frecuencia = item.frecuencia;

    if (!acumulador[fecha]) {
      acumulador[fecha] = 0;
    }

    acumulador[fecha] += frecuencia;
  });

  return Object.entries(acumulador).map(([fecha, frecuencia]) => ({
    fecha,
    frecuencia
  }));
};

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

  // Procesar emociones para pastel
  const emocionesAgrupadas = estadisticas?.distribucion_emociones
    ? agruparEmociones(estadisticas.distribucion_emociones)
    : [];

  const dataPie = emocionesAgrupadas.length > 0 ? {
    labels: emocionesAgrupadas.map((item) => item.emocion),
    datasets: [
      {
        label: "Frecuencia de Emociones",
        data: emocionesAgrupadas.map((item) => item.frecuencia),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        hoverOffset: 4,
      },
    ],
  } : null;

  // Procesar tendencias emocionales por fecha (line chart)
  const tendenciasAgrupadas = estadisticas?.tendencias_emocionales
    ? agruparFrecuenciasPorFecha(estadisticas.tendencias_emocionales)
    : [];

  const dataLine = tendenciasAgrupadas.length > 0 ? {
    labels: tendenciasAgrupadas.map((item) => item.fecha),
    datasets: [{
      label: "Frecuencia total de emociones",
      data: tendenciasAgrupadas.map((item) => item.frecuencia),
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
    }],
  } : null;

  return (
  <div className="bg-gray-100 min-h-screen">
    <MenuSuperiorAdmin />
    <div className="container">
      <h2 className="text-2xl font-bold mb-6">Dashboard del Administrador</h2>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded shadow">{error}</p>}

      {estadisticas ? (
        <>
          {/* Tarjetas */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <FaChartLine className="text-blue-600 text-4xl" />
              <div>
                <h3>Total de Sesiones en las que el Modelo fué usado </h3>
                <p>{estadisticas.total_sesiones}</p>
              </div>
            </div>
            <div className="dashboard-card">
              <FaUsers className="text-green-600 text-4xl" />
              <div>
                <h3>Usuarios Registrados</h3>
                <p>{estadisticas.total_usuarios}</p>
              </div>
            </div>
            <div className="dashboard-card">
              {iconoEmocion[traducir(estadisticas.emocion_predominante)] || (
                <FaSmile className="text-yellow-600 text-4xl" />
              )}
              <div>
                <h3>Emoción Predominante</h3>
                <p>{traducir(estadisticas.emocion_predominante)}</p>
              </div>
            </div>
          </div>

                    {/* Gráficos */}
          <div className="charts-column">
            <div className="chart-card">
              <h3>Distribución de Emociones</h3>
              <div className="chart-wrapper">
                {dataPie ? (
                  <Pie data={dataPie} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                  <p className="text-gray-500 text-center">No hay datos para el gráfico de pastel.</p>
                )}
              </div>
            </div>
            <div className="chart-card mt-8">
              <h3>Cantidad de emociones predichas por dia</h3>
              <div className="chart-wrapper">
                {dataLine ? (
                  <Line data={dataLine} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                  <p className="text-gray-500 text-center">No hay datos para el gráfico de líneas.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        !error && <p className="text-gray-500 text-center">Cargando estadísticas...</p>
      )}
    </div>
  </div>
);

}

export default MenuAdmin;
