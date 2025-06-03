import React, { useState, useEffect } from "react";
import MenuSuperior from "../components/MenuSuperior"; 
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import "chartjs-adapter-moment";
import "../styles/mis_interacciones.css";

//  Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

function MisInteracciones() {
    const [emociones, setEmociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filtroEmocion, setFiltroEmocion] = useState("todas");

    useEffect(() => {
        const fetchData = async () => {
            const idSesion = localStorage.getItem("id_sesion");

            if (!idSesion) {
                setError("No se encontró una sesión activa");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/emotions?id_sesion=${idSesion}`);
                const data = await response.json();

                if (response.ok) {
                    setEmociones(data.emociones || []);
                } else {
                    setError(data.error || "Error al obtener los datos");
                }
            } catch (err) {
                console.error("Error en la petición:", err);
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const emocionesUnicas = [...new Set(emociones.map(e => e.emocion))];

    const cambiarFiltro = (emocion) => {
        setFiltroEmocion(emocion);
    };

    const emocionesFiltradas = filtroEmocion === "todas"
        ? emociones
        : emociones.filter(e => e.emocion === filtroEmocion);

    // Procesar datos para el gráfico de barras (Cantidad de emociones)
    const procesarDatosCantidad = () => {
        if (!emocionesFiltradas || emocionesFiltradas.length === 0) return null;

        const conteoEmociones = emocionesFiltradas.reduce((acc, emocion) => {
            acc[emocion.emocion] = (acc[emocion.emocion] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(conteoEmociones),
            datasets: [
                {
                    label: "Cantidad de emociones detectadas",
                    data: Object.values(conteoEmociones),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    borderColor: "#333",
                    borderWidth: 1,
                },
            ],
        };
    };

    // Procesar datos para el gráfico de líneas (Intensidad promedio por emoción en el tiempo con más fechas)
    const procesarDatosIntensidad = () => {
        if (!emocionesFiltradas || emocionesFiltradas.length === 0) return null;

        const datosPorFecha = {};
        emocionesFiltradas.forEach((emocion) => {
            const fechaObj = new Date(emocion.timestamp);
            const fecha = fechaObj.getFullYear() + "-" +
                          String(fechaObj.getMonth() + 1).padStart(2, "0") + "-" +
                          String(fechaObj.getDate()).padStart(2, "0");

            if (!datosPorFecha[fecha]) {
                datosPorFecha[fecha] = {};
            }
            if (!datosPorFecha[fecha][emocion.emocion]) {
                datosPorFecha[fecha][emocion.emocion] = { sumaIntensidad: 0, conteo: 0 };
            }
            datosPorFecha[fecha][emocion.emocion].sumaIntensidad += emocion.intensidad;
            datosPorFecha[fecha][emocion.emocion].conteo += 1;
        });

        const fechas = Object.keys(datosPorFecha).sort();
        if (fechas.length === 0) return null;

        const rangoFechas = fechas;

        const emocionesUnicasInternas = [...new Set(emocionesFiltradas.map(e => e.emocion))];

        const coloresEmociones = {
            "neutro": "#999999",
            "feliz": "#36A2EB",
            "triste": "#FF6384",
            "enojado": "#FFCE56",
            "sorprendido": "#4BC0C0"
        };

        const datasets = emocionesUnicasInternas.map((emocion) => {
            const data = rangoFechas.map((fecha) =>
                datosPorFecha[fecha] && datosPorFecha[fecha][emocion]
                    ? datosPorFecha[fecha][emocion].sumaIntensidad / datosPorFecha[fecha][emocion].conteo
                    : null
            );

            return {
                label: `Intensidad de ${emocion}`,
                data: data,
                fill: false,
                borderColor: coloresEmociones[emocion] || "#000000",
                tension: 0.3,
            };
        });

        return {
            labels: rangoFechas,
            datasets: datasets,
        };
    };

    return (
        <div>
            <MenuSuperior />

            <div className="contenido-pagina">

                {/* Filtros de emociones */}
                <div className="filtros-container">
                    <button
                        className={filtroEmocion === "todas" ? "activo" : ""}
                        onClick={() => cambiarFiltro("todas")}
                    >
                        Todas
                    </button>
                    {emocionesUnicas.map((emocion) => (
                        <button
                            key={emocion}
                            className={filtroEmocion === emocion ? "activo" : ""}
                            onClick={() => cambiarFiltro(emocion)}
                        >
                            {emocion.charAt(0).toUpperCase() + emocion.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        {/*Contenedor con los gráficos más grandes */}
                        <div className="graficos-container">
                            {emocionesFiltradas.length > 0 && (
                                <div className="grafico">
                                    <h3>Resumen de Emociones Detectadas</h3>
                                    <Bar data={procesarDatosCantidad()} options={{ maintainAspectRatio: false }} />
                                </div>
                            )}

                            {/*Gráfico de intensidad con más fechas en el eje X */}
                            {emocionesFiltradas.length > 0 && (
                                <div className="grafico">
                                    <h3>Intensidad Promedio de Emociones</h3>
                                    <Line data={procesarDatosIntensidad()} options={{ maintainAspectRatio: false }} />
                                </div>
                            )}
                        </div>

                        {/*Tabla con scroll */}
                        {emocionesFiltradas.length > 0 && (
                            <div className="emociones-table-container">
                                <h2>Historial de Emociones Detectadas</h2>
                                <div className="tabla-scroll">
                                    <table className="interacciones-table">
                                        <thead>
                                            <tr>
                                                <th>Emoción</th>
                                                <th>Intensidad</th>
                                                <th>Fecha y Hora</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emocionesFiltradas.map((emocion, index) => (
                                                <tr key={index}>
                                                    <td>{emocion.emocion}</td>
                                                    <td>{emocion.intensidad}%</td>
                                                    <td>{new Date(emocion.timestamp).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default MisInteracciones;
