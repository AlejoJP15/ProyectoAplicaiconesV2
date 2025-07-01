// src/pages/visualizar_estadisticas_admin.js
import React, { useState, useEffect, useRef } from "react";
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Tooltip, List, ListItem, ListItemText, Skeleton
} from "@mui/material";
import { Pie, Line, Radar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler } from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DashboardLayout from "../layouts/DashboardLayout";

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler);

function VisualizarEstadisticas() {
  const sessionId = localStorage.getItem("id_sesion");
  const [filtros, setFiltros] = useState({ inicio: "", fin: "", emocion: "", agrupacion: "day" });
  const [emocionMulti, setEmocionMulti] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState(null);
  const [selecciones, setSelecciones] = useState({ incluirTendencias: true, incluirUsuarios: true, comentarios: "" });

  const refBarChart = useRef();
  const refPieChart = useRef();

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
        const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
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

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleCheckboxChange = (emo) => {
    setEmocionMulti(prev => prev.includes(emo) ? prev.filter(item => item !== emo) : [...prev, emo]);
  };

  const handleSeleccionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelecciones({ ...selecciones, [name]: type === "checkbox" ? checked : value });
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte Personalizado de Estadísticas", 10, 10);
    if (selecciones.comentarios) {
      doc.setFontSize(12);
      doc.text(`Comentarios: ${selecciones.comentarios}`, 10, 20);
    }
    let y = 30;
    if (selecciones.incluirTendencias && refBarChart.current) {
      const img = refBarChart.current.toBase64Image();
      doc.text("Gráfico de Tendencias Emocionales", 10, y);
      doc.addImage(img, "PNG", 10, y + 10, 180, 80);
      y += 100;
    }
    if (selecciones.incluirUsuarios && refPieChart.current) {
      const img = refPieChart.current.toBase64Image();
      doc.text("Gráfico de Distribución Histórica por Intensidad Emocional", 10, y);
      doc.addImage(img, "PNG", 10, y + 10, 180, 80);
    }
    doc.save("reporte_personalizado.pdf");
  };

  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;
  if (!estadisticas) return <Skeleton variant="rectangular" height={400} sx={{ mx: 4 }} />;

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom align="center">Visualización de Estadísticas</Typography>

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filtros</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Fecha Inicio" type="date" name="inicio" value={filtros.inicio} onChange={handleFiltroChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Fecha Fin" type="date" name="fin" value={filtros.fin} onChange={handleFiltroChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Emoción</InputLabel>
                <Select name="emocion" value={filtros.emocion} onChange={handleFiltroChange} label="Emoción">
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="feliz">Feliz</MenuItem>
                  <MenuItem value="triste">Tristeza</MenuItem>
                  <MenuItem value="enojado">Enojo</MenuItem>
                  <MenuItem value="sorprendido">Sorpresa</MenuItem>
                  <MenuItem value="neutro">Neutro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Agrupación</InputLabel>
                <Select name="agrupacion" value={filtros.agrupacion} onChange={handleFiltroChange} label="Agrupación">
                  <MenuItem value="day">Día</MenuItem>
                  <MenuItem value="month">Mes</MenuItem>
                  <MenuItem value="year">Año</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Tooltip title="Gráfico circular de distribución por rango de intensidad emocional">
                <Typography variant="h6" gutterBottom align="center">Distribución por Rango de Intensidad</Typography>
              </Tooltip>
              <Box sx={{ height: 300 }}>
                <Pie
                  data={{
                    labels: estadisticas.distribucion_intensidad.map((item) => item.rango),
                    datasets: [{
                      data: estadisticas.distribucion_intensidad.map((item) => item.total),
                      backgroundColor: ["#81C784", "#FFB74D", "#E57373"],
                      hoverBackgroundColor: ["#A5D6A7", "#FFD54F", "#EF9A9A"]
                    }]
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  ref={refPieChart}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ height: 500 , width: 400}}>
            <CardContent>
              <Tooltip title={`Gráfico de líneas que representa la intensidad emocional promedio agrupada por ${filtros.agrupacion}`}>
                <Typography variant="h6" gutterBottom align="center">Intensidad Promedio ({filtros.agrupacion})</Typography>
              </Tooltip>
              <Box sx={{ height: 400 }}>
                <Line
                  data={{
                    labels: estadisticas.line_chart_data.map((item) => item.fecha_agrupada),
                    datasets: [{
                      label: "Intensidad Promedio",
                      data: estadisticas.line_chart_data.map((item) => item.intensidad_promedio),
                      fill: true,
                      borderColor: "rgba(54, 162, 235, 1)",
                      backgroundColor: "rgba(54, 162, 235, 0.2)"
                    }]
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
                  ref={refBarChart}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
              <List>
                <ListItem><ListItemText primary="Sesión registrada" secondary="15 junio - 10:42 AM" /></ListItem>
                <ListItem><ListItemText primary="Emoción predominante: Feliz" secondary="15 junio - 10:41 AM" /></ListItem>
                <ListItem><ListItemText primary="Exportación de reporte" secondary="14 junio - 5:15 PM" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Personalización del Reporte</Typography>
          <FormControlLabel control={<Checkbox checked={selecciones.incluirTendencias} onChange={handleSeleccionChange} name="incluirTendencias" />} label="Incluir Gráfico de Tendencias" />
          <FormControlLabel control={<Checkbox checked={selecciones.incluirUsuarios} onChange={handleSeleccionChange} name="incluirUsuarios" />} label="Incluir Gráfico de Historia de Rango por Intensidad" />
          <TextField label="Comentarios" name="comentarios" value={selecciones.comentarios} onChange={handleSeleccionChange} multiline rows={3} fullWidth sx={{ mt: 2 }} />
        </CardContent>
      </Card>

      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" onClick={exportarPDF} size="large">
          Generar Reporte
        </Button>
      </Box>
    </DashboardLayout>
  );
}

export default VisualizarEstadisticas;
