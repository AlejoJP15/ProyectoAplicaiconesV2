import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importa tus componentes
import Login from "./shared/login";
import Register from "./shared/register";
import MenuUsuario from "./user/menu_usuario";
import MenuAdmin from "./admin/menu_admin";
import ListaUsuarios from "./admin/gestion_usuario_admin";
import VisualizarEstadisticas from "./admin/visualizar_estadisticas_admin";
import ForgotPassword from "./shared/ForgotPassword";
import ResetPassword from "./shared/ResetPassword";
import ActualizaUser from "./user/ActualizaUser";
import CameraStream from "./user/CameraStream";
import MisInteracciones from "./user/mis-interacciones";
import ParametrosSistemaAdmin from "./admin/ParametrosSistemaAdmin";
function App() {
  // 1) Definimos estado local para autenticación
  const [auth, setAuth] = useState({
    isAuthenticated: !!localStorage.getItem("id_sesion"),
    userRole: localStorage.getItem("role"),
  });

  // 2) Función que re-lee localStorage y actualiza el estado local
  const refreshAuthState = () => {
    setAuth({
      isAuthenticated: !!localStorage.getItem("id_sesion"),
      userRole: localStorage.getItem("role"),
    });
  };

  const { isAuthenticated, userRole } = auth;

  return (
    <Router>
      <Routes>
        {/* Ruta principal: redirige al login si no está autenticado */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? (userRole === "admin" ? "/admin/menu_admin" : "/menu_usuario")
                  : "/login"
              }
            />
          }
        />
      {/* Rutas para recuperación de contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Rutas del login y registro */}
        <Route
          path="/login"
          // Pasamos la función refreshAuthState como prop a Login
          element={<Login onLoginSuccess={refreshAuthState} />}
        />
        <Route path="/register" element={<Register />} />

        {/* Menú para usuario */}
        <Route
          path="/menu_usuario"
          element={
            isAuthenticated ? (
              userRole !== "admin" ? (
                <MenuUsuario />
              ) : (
                <Navigate to="/admin/menu_admin" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Menú para administrador */}
        <Route
          path="/admin/menu_admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <MenuAdmin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
                  path="/admin/visualizar_estadisticas_admin"
                  element={
                    isAuthenticated && userRole === "admin" ? (
                      <VisualizarEstadisticas />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
          />

        <Route
                  path="/user/ActualizaUser"
                  element={
                    isAuthenticated && userRole !== "admin" ? (
                      <ActualizaUser />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
        <Route
            path="/mis-interacciones"
            element={
              isAuthenticated && userRole !== "admin" ? (
                <MisInteracciones />
              ) : (
                <Navigate to="/login" />
              )
            }
        />

        <Route
            path="/camera-stream"
            element={
              isAuthenticated && userRole !== "admin" ? (
                <CameraStream />
              ) : (
                <Navigate to="/login" />
              )
            }
        />
        <Route
          path="/admin/gestion_usuario_admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <ListaUsuarios />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/parametros_sistema_admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <ParametrosSistemaAdmin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
