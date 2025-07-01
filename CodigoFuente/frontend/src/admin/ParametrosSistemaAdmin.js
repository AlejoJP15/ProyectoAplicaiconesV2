import React, { useEffect, useState } from "react";
import MenuSuperiorAdmin from "../components/MenuSuperiorAdmin";
import "../styles/menu_usuario.css"; // Usa los estilos que ya tienes

const ParametrosSistemaAdmin = () => {
  const [parametros, setParametros] = useState({
    tiempo_bloqueo_minutos: "",
    intentos_fallidos_maximos: "",
    duracion_token_recuperacion_minutos: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/parametros-sistema")
      .then((res) => res.json())
      .then((data) => {
        setParametros(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar parámetros:", err);
        setMensaje("No se pudieron cargar los parámetros del sistema");
        setCargando(false);
      });
  }, []);

  const handleChange = (e) => {
    setParametros({ ...parametros, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    setMensaje("");
    fetch("http://localhost:5000/api/parametros-sistema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parametros),
    })
      .then((res) => res.json())
      .then((data) => setMensaje(data.message || "Guardado correctamente"))
      .catch(() => setMensaje("Error al guardar los parámetros"));
  };

  return (
    <div>
      <MenuSuperiorAdmin />
      <div className="contenedor-principal">

        
        <h2 className="titulo-pagina">Configuración de Parámetros del Sistema</h2>

        {cargando ? (
          <p className="mensaje-cargando">Cargando parámetros...</p>
        ) : (
          <div className="form-parametros tarjeta">
            <div className="campo-formulario">
              <label htmlFor="tiempo_bloqueo_minutos">
                Tiempo de bloqueo (minutos):
              </label>
              <input
                type="number"
                id="tiempo_bloqueo_minutos"
                name="tiempo_bloqueo_minutos"
                value={parametros.tiempo_bloqueo_minutos}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="intentos_fallidos_maximos">
                Intentos fallidos permitidos:
              </label>
              <input
                type="number"
                id="intentos_fallidos_maximos"
                name="intentos_fallidos_maximos"
                value={parametros.intentos_fallidos_maximos}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="duracion_token_recuperacion_minutos">
                Duración del token de recuperación (minutos):
              </label>
              <input
                type="number"
                id="duracion_token_recuperacion_minutos"
                name="duracion_token_recuperacion_minutos"
                value={parametros.duracion_token_recuperacion_minutos}
                onChange={handleChange}
                min="1"
              />
            </div>

            <button className="boton-guardar" onClick={handleGuardar}>
              Guardar Cambios
            </button>

            {mensaje && <p className="mensaje">{mensaje}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametrosSistemaAdmin;
