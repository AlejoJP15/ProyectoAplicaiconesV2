import React, { useState, useEffect, useRef } from "react";
import MenuSuperiorAdmin from "../components/MenuSuperiorAdmin";
import { useNavigate } from "react-router-dom"; // Import para navegar
import { Pie, Bar, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
 import '../styles/dashboard.css';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);
 
function VisualizarEstadisticas() {
  // ========== Manejo de navegación y sesión ==========
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("id_sesion");
 
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
 
  // ========== ESTADOS ==========
  const [filtros, setFiltros] = useState({ inicio: "", fin: "", emocion: "", agrupacion: "day" });
  const [emocionMulti, setEmocionMulti] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);
  const [selecciones, setSelecciones] = useState({
    incluirTendencias: true,
    incluirUsuarios: true,
    comentarios: ""
  });
 
  // Referencias a los gráficos para PDF
  const refBarChart = useRef();
  const refPieChart = useRef();
  const refOrigenChart = useRef();
 
  // ========== FETCH DATOS ==========
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const params = new URLSearchParams();
        if (filtros.inicio) params.append("inicio", filtros.inicio);
        if (filtros.fin) params.append("fin", filtros.fin);
        if (filtros.emocion) params.append("emocion", filtros.emocion);
        if (filtros.agrupacion) params.append("agrupacion", filtros.agrupacion);
        emocionMulti.forEach((emo) => params.append("emocionMulti", emo));
 
        const url = `http://localhost:5000/visualiza_estadistica?${params.toString()}`;
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Error al obtener las estadísticas");
        const data = await response.json();
        setEstadisticas(data);
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError("No se pudieron cargar las estadísticas");
      }
    };
    fetchEstadisticas();
  }, [filtros, emocionMulti]);
 
  // ========== MANEJADORES ==========
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };
 
  const handleCheckboxChange = (emo) => {
    if (emocionMulti.includes(emo)) {
      setEmocionMulti(emocionMulti.filter((item) => item !== emo));
    } else {
      setEmocionMulti([...emocionMulti, emo]);
    }
  };
 
  const handleSeleccionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelecciones({ ...selecciones, [name]: type === "checkbox" ? checked : value });
  };
 
  // ========== EXPORTAR PDF ==========
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte Personalizado de Estadísticas", 10, 10);
 
    if (selecciones.comentarios) {
      doc.setFontSize(12);
      doc.text(`Comentarios: ${selecciones.comentarios}`, 10, 20);
    }
 
    let posicionY = 30; // Posición inicial para agregar gráficos
 
    // Gráfico de Líneas (Intensidad Promedio)
    if (selecciones.incluirTendencias && refBarChart.current) {
      const barImage = refBarChart.current.toBase64Image();
      doc.text("Gráfico de Tendencias Emocionales", 10, posicionY);
      doc.addImage(barImage, "PNG", 10, posicionY + 10, 180, 80);
      posicionY += 100; // Ajustar la posición para el siguiente gráfico
    }
 
    // Gráfico de Pastel (Distribución por Origen)
    if (selecciones.incluirUsuarios && refPieChart.current) {
      const pieImage = refPieChart.current.toBase64Image();
      doc.text("Gráfico de Distribución Histórica por Intensidad Emocional", 10, posicionY);
      doc.addImage(pieImage, "PNG", 10, posicionY + 10, 180, 80);
      posicionY += 100; // Ajustar la posición para el siguiente gráfico
    }
 
    doc.save("reporte_personalizado.pdf");
  };
 
  // ========== RENDER ==========
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!estadisticas) return <p className="text-gray-500 text-center mt-4">Cargando estadísticas...</p>;
 
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ========== MENÚ SUPERIOR ========== */}
      <nav className="bg-blue-600 text-white shadow-lg">
          <MenuSuperiorAdmin />  {/* Aquí se usa el menú reutilizable */}
          <div className="contenido-pagina">
            {/* Contenido de la página */}
          </div>
      </nav>
 
      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Visualización de Estadísticas</h1>
 
        {/* ========== FILTROS ========== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="card-title">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="filters-grid">Emoción (Single)</label>
              <select
                name="emocion"
                onChange={handleFiltroChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Todas</option>
                <option value="feliz">Feliz</option>
                <option value="triste">Tristeza</option>
                <option value="enojado">Enojo</option>
                <option value="sorprendido">Sorpresa</option>
                <option value="neutro">Neutro</option>
              </select>
            </div>
 
            <div>
              <label className="filters-grid">Agrupación</label>
              <select
                name="agrupacion"
                onChange={handleFiltroChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={filtros.agrupacion}
              >
                <option value="day">Día</option>
                <option value="month">Mes</option>
                <option value="year">Año</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gráfico de Pastel (Distribución por Intensidad Emocional) */}
        <div className="chart-container">
          <div className="card">
            <h2 className="card-title">Distribución Histórica por Rango de Intensidad</h2>
            <div className="w-full flex justify-center">
              <Pie
                data={{
                  labels: estadisticas.distribucion_intensidad.map((item) => item.rango),
                  datasets: [
                    {
                      data: estadisticas.distribucion_intensidad.map((item) => item.total),
                      backgroundColor: ["#81C784", "#FFB74D", "#E57373"], // Verde, naranja, rojo
                      hoverBackgroundColor: ["#A5D6A7", "#FFD54F", "#EF9A9A"]
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.label || "";
                          let value = context.parsed;
                          return `${label}: ${value}`;
                        }
                      }
                    }
                  }
                }}
                ref={refPieChart} // reutilizamos la referencia original si exportas a PDF
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
 
        
 
        {/* Gráfico de Líneas (Intensidad Promedio) */}
        <div className="chart-container">
          <div className="card">
            <h2 className="card-title">
              Intensidad Promedio ({filtros.agrupacion})
            </h2>
            <div className="w-full h-96 flex justify-center">
            <Line
              data={{
                labels: estadisticas.line_chart_data.map((item) => item.fecha_agrupada),
                datasets: [
                  {
                    label: "Intensidad Promedio",
                    data: estadisticas.line_chart_data.map((item) => item.intensidad_promedio),
                    fill: true,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)"
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    suggestedMin: 0,
                    suggestedMax: 1
                  }
                }
              }}
              ref={refBarChart} // Referencia para el gráfico de líneas
            />
            </div>
          </div>
        </div>
 
        {/* Opciones de Reporte */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
          <h2 className="card-title">Personalización del Reporte</h2>
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              name="incluirTendencias"
              checked={selecciones.incluirTendencias}
              onChange={handleSeleccionChange}
              className="mr-2"
            />
            Incluir Gráfico de Tendencias
          </label>
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              name="incluirUsuarios"
              checked={selecciones.incluirUsuarios}
              onChange={handleSeleccionChange}
              className="mr-2"
            />
            Incluir Gráfico de Historia de Rango por Intensidad
          </label>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Comentarios</label>
            <textarea
              name="comentarios"
              value={selecciones.comentarios}
              onChange={handleSeleccionChange}
              rows="3"
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
 
        <div className="text-center mt-8">
          <button
            onClick={exportarPDF}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}
 
/** Sub-componente: RadarOrigenEmocion */
function RadarOrigenEmocion({ dataRadar }) {
  // Lista fija de emociones para que el radar no se colapse
  const ALL_EMOTIONS = ["feliz", "triste", "enojado", "sorprendido", "neutro"];
 
  // Orígenes únicos que vengan en la data
  const origenesUnicos = Array.from(new Set(dataRadar.map(d => d.origen)));
 
  // Para cada origen, construimos un dataset
  const colors = [
    "rgba(255,99,132,0.6)",
    "rgba(54,162,235,0.6)",
    "rgba(255,206,86,0.6)",
    "rgba(75,192,192,0.6)",
    "rgba(153,102,255,0.6)",
    "rgba(255,159,64,0.6)"
  ];
 
  const datasets = origenesUnicos.map((orig, idx) => {
    const c = colors[idx % colors.length];
    // Recorremos la lista completa ALL_EMOTIONS y rellenamos con 0 si no hay datos
    const dataArr = ALL_EMOTIONS.map(emo => {
      const row = dataRadar.find(x => x.origen === orig && x.emocion === emo);
      return row ? row.total_usuarios : 0;
    });
 
    return {
      label: orig,
      data: dataArr,
      backgroundColor: c,
      borderColor: c.replace("0.6", "1"),
      borderWidth: 2,
      fill: true
    };
  });
 
  // El eje radial (labels) siempre será ALL_EMOTIONS
  const radarData = {
    labels: ALL_EMOTIONS,
    datasets
  };
 
  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0
      }
    }
  };
 
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="card-title">Radar: Origen vs Emoción</h2>
      <div style={{ width: "500px", margin: "0 auto" }}>
        <Radar data={radarData} options={radarOptions} />
      </div>
    </div>
  );
}
 
export default VisualizarEstadisticas;