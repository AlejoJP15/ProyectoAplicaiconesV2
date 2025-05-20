import React from "react";
import { useNavigate } from "react-router-dom";
import MenuSuperior from "../components/MenuSuperior"; 
import { FaBrain, FaSmile, FaChartLine } from "react-icons/fa";
import "../styles/menu_usuario.css";

function MenuUsuario() {
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
    <div>
      {/* Menú Superior */}
      <nav className="navbar">
      <div>
            <MenuSuperior /> {/* Aquí se usa el menú reutilizable */}
            <div className="contenido-pagina">
              {/* Contenido de la página */}
            </div>
       </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="animate-fade-in">¡Explora el Futuro de la Tecnología Emocional!</h1>
          <p className="animate-slide-up">
            Sumérgete en el mundo del reconocimiento emocional mediante expresiones faciales. Una experiencia de vanguardia diseñada para ti.
          </p>
          
        </div>
        <div className="hero-image animate-zoom-in">
            <img
            src="LogoMenuUsuario.png"
            alt="Tecnología Emocional"
          />
        </div>
      </section>

      <section className="features-section">
        <h2 className="animate-fade-in">¿Dónde se aplica el reconocimiento emocional?</h2>
        <div className="features-container">
          <div className="feature-item animate-slide-up">
            <h3>Salud y bienestar</h3>
            <p>Monitorea el estado emocional de pacientes para mejorar diagnósticos y terapias.</p>
          </div>
          <div className="feature-item animate-slide-up">
            <h3>Atención al cliente</h3>
            <p>Identifica emociones en tiempo real para saber como mejorar la atencion.</p>
          </div>
          <div className="feature-item animate-slide-up">
            <h3>Educación</h3>
            <p>Comprende el estado emocional de los estudiantes y mejora el entorno de aprendizaje.</p>
          </div>
          <div className="feature-item animate-slide-up">
            <h3>Recursos Humanos</h3>
            <p>Evalúa el clima laboral, identifica estados de animo y fortalece el bienestar organizacional.</p>
          </div>
        </div>
      </section>



      {/* Testimonios */}
      <section className="features-section">
        <h2 className="animate-fade-in">Explora nuestras funciones</h2>
        <div className="features-container">
          <div className="feature-item animate-slide-up">
            <FaBrain size={30} style={{ marginBottom: "10px", color: "#2563eb" }} />
            <h3>Análisis en tiempo real</h3>
            <p>Detectamos emociones faciales al instante durante las sesiones.</p>
          </div>
          <div className="feature-item animate-slide-up">
            <FaSmile size={30} style={{ marginBottom: "10px", color: "#f59e0b" }} />
            <h3>Detección de expresiones</h3>
            <p>Identifica emociones como alegría, enojo, tristeza, sorpresa y más.</p>
          </div>
          <div className="feature-item animate-slide-up">
            <FaChartLine size={30} style={{ marginBottom: "10px", color: "#10b981" }} />
            <h3>Reportes y seguimiento</h3>
            <p>Visualiza el historial emocional de los usuarios para evaluar progreso o patrones.</p>
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="footer">
        <div className="footer-content animate-fade-in">
          <p>&copy; 2025 Mi Proyecto AI. Todos los derechos reservados.</p>
          <ul className="footer-links">
           
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default MenuUsuario;






