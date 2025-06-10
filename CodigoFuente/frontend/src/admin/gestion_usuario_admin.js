import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuSuperiorAdmin from "../components/MenuSuperiorAdmin";
function ListaUsuarios() {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("id_sesion");
 
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
 const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
 
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/lista_usuarios", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
 
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
 
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
 
      if (!Array.isArray(data)) {
        throw new Error("Los datos recibidos no son un array de usuarios");
      }
 
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError(error.message || "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };
 
  const eliminar_usuario = async (id_usuario) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;
    try {
      const response = await fetch("http://localhost:5000/lista_usuarios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario }),
      });
 
      if (!response.ok) {
        throw new Error("Error al eliminar Usuario");
      }
 
      const data = await response.json();
      console.log(data.message);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((u) => u.id_usuario !== id_usuario)
      );
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setError(error.message || "No se pudo eliminar el usuario");
    }
  };
  const editarRolUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoRol(usuario.rol);
    setModalAbierto(true);
  };
 
  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setNuevoRol("");
  };
  const actualizarRolUsuario = async () => {
    if (!usuarioEditando || !nuevoRol) return;
 
    try {
      const response = await fetch(`http://localhost:5000/usuarios/${usuarioEditando.id_usuario}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
 
      if (!response.ok) {
        throw new Error("Error al actualizar el rol del usuario");
      }
 
      const data = await response.json();
      console.log(data.message);
 
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((u) =>
          u.id_usuario === usuarioEditando.id_usuario ? { ...u, rol: nuevoRol } : u
        )
      );
 
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      setError(error.message || "No se pudo actualizar el rol del usuario");
    }
  };
 
  const eliminar_tabla_bot = async () => {
    const confirmar = window.confirm("¿Estás seguro de eliminar la tabla de interacción del chatbot?");
    if(!confirmar) return;
 
    try {
      const response = await fetch("http://localhost:5000/delete_interaction_chatbot", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
 
      if (!response.ok) {
        throw new Error("Error al eliminar la tabla de interacción del chatbot");
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error al eliminar la tabla de interacción del chatbot:", error);
      setError(error.message || "No se pudo eliminar la tabla de interacción del chatbot");
    }
  };
 
  useEffect(() => {
    fetchUsuarios();
  }, []);
 
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="bg-gray-50 min-h-screen">
      <MenuSuperiorAdmin />  {/* Aquí se usa el menú reutilizable */}
      <div className="contenido-pagina">
        {/* Contenido de la página */}
      </div>
 
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Usuarios</h1>
 
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
        </div>
 
        {/* Botón para eliminar todos los datos de la tabla interacciones_chatbot */}
        <div className="mb-6">
          <button
            onClick={eliminar_tabla_bot}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Eliminar Datos de Interacciones Chatbot
          </button>
        </div>
 
        {loading && (
          <p className="text-gray-500 text-center">Cargando usuarios...</p>
        )}
        {error && (
          <p className="text-red-500 text-center bg-red-50 p-4 rounded mb-4">
            {error}
          </p>
        )}
        {!loading && !error && filteredUsuarios.length > 0 && (
          <div className="flex flex-col mt-4">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-sm rounded-lg">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b bg-white font-medium">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-gray-700">ID</th>
                        <th scope="col" className="px-6 py-4 text-gray-700">Nombre</th>
                        <th scope="col" className="px-6 py-4 text-gray-700">Correo</th>
                        <th scope="col" className="px-6 py-4 text-gray-700">Rol</th>
                        <th scope="col" className="px-6 py-4 text-center text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.map((usuario, index) => (
                        <tr
                          key={usuario.id_usuario}
                          className={`border-b hover:bg-gray-50 transition duration-200 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-700">
                            {usuario.id_usuario}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {usuario.nombre}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {usuario.correo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                            {usuario.rol}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <button
                              onClick={() => eliminar_usuario(usuario.id_usuario)}
                              className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => editarRolUsuario(usuario)}
                              className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200"
                              >
                              Editar Rol
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {!loading && !error && filteredUsuarios.length === 0 && (
          <p className="text-gray-500 text-center mt-6">
            No hay usuarios registrados.
          </p>
        )}
      </div>
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Rol de {usuarioEditando.nombre}</h2>
            <select
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent mb-4"
            >
              <option value="usuario">usuario</option>
              <option value="admin">admin</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cerrarModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarRolUsuario}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default ListaUsuarios;