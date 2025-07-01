// src/pages/menu_admin.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { FaChartLine, FaUsers, FaSmile, FaFrown, FaAngry, FaMeh, FaSurprise, FaTired, FaGrinSquint } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

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

const iconoEmocion = {
  feliz: <FaSmile size={40} color="#fbc02d" />,
  triste: <FaFrown size={40} color="#2196f3" />,
  enojado: <FaAngry size={40} color="#f44336" />,
  neutro: <FaMeh size={40} color="#9e9e9e" />,
  sorprendido: <FaSurprise size={40} color="#ab47bc" />,
  temeroso: <FaTired size={40} color="#3f51b5" />,
  disgustado: <FaGrinSquint size={40} color="#e91e63" />,
};

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
  neutro: "neutro",
};

const traducir = (emocion) => traducciones[emocion?.toLowerCase()] || emocion;

const agruparEmociones = (emociones) => {
  const agrupadas = {};
  emociones.forEach(({ emocion, frecuencia }) => {
    const emocionTraducida = traducir(emocion);
    agrupadas[emocionTraducida] = (agrupadas[emocionTraducida] || 0) + frecuencia;
  });
  return Object.entries(agrupadas).map(([emocion, frecuencia]) => ({ emocion, frecuencia }));
};

const agruparFrecuenciasPorFecha = (datos) => {
  const acumulador = {};
  datos.forEach(({ fecha, frecuencia }) => {
    acumulador[fecha] = (acumulador[fecha] || 0) + frecuencia;
  });
  return Object.entries(acumulador).map(([fecha, frecuencia]) => ({ fecha, frecuencia }));
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
        if (!response.ok) throw new Error("Error al obtener las estadísticas");
        const data = await response.json();
        setEstadisticas(data);
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError("No se pudieron cargar las estadísticas");
      }
    };
    fetchEstadisticas();
  }, []);

  const emocionesAgrupadas = estadisticas?.distribucion_emociones ? agruparEmociones(estadisticas.distribucion_emociones) : [];
  const dataPie = emocionesAgrupadas.length > 0 ? {
    labels: emocionesAgrupadas.map((item) => item.emocion),
    datasets: [{
      label: "Frecuencia de Emociones",
      data: emocionesAgrupadas.map((item) => item.frecuencia),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      hoverOffset: 4,
    }],
  } : null;

  const tendenciasAgrupadas = estadisticas?.tendencias_emocionales ? agruparFrecuenciasPorFecha(estadisticas.tendencias_emocionales) : [];
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
    <DashboardLayout>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard del Administrador - Resumen de estadisticas principales.
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}

      {estadisticas && (
        <Box maxWidth="xl" mx="auto">
          <Grid container spacing={3} justifyContent="center">
            {[{
              icon: <FaChartLine size={30} color="#1976d2" />, label: "Total de Sesiones en que se uso el modelo", value: estadisticas.total_sesiones
            }, {
              icon: <FaUsers size={30} color="#2e7d32" />, label: "Usuarios Registrados", value: estadisticas.total_usuarios
            }, {
              icon: iconoEmocion[traducir(estadisticas.emocion_predominante)], label: "Emoción Predominante", value: traducir(estadisticas.emocion_predominante)
            }].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      {item.icon}
                      <div>
                        <Typography variant="h6">{item.label}</Typography>
                        <Typography variant="h4">{item.value}</Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={5} sx={{ mt: 5 }}justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom align="center">Distribución de Emociones</Typography>
                  {dataPie ? (
                    <Box sx={{ height: 400 }}>
                      <Pie
                        data={dataPie}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </Box>
                  ) : (
                    <Typography>No hay datos disponibles.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ height: 400, display: 'flex', flexDirection: 'column', width: 700 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom align="center">Emociones por Día</Typography>
                  {dataLine ? (
                    <Box sx={{ height: 300, width: '100%' }}>
                      <Line
                        data={dataLine}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography>No hay datos disponibles.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

      
          </Grid>
        </Box>
      )}
    </DashboardLayout>
  );
}

export default MenuAdmin;
