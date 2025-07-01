import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Select, MenuItem, InputLabel, FormControl,
  Typography, Grid
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/lista_usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const eliminar_usuario = async (id_usuario) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const response = await fetch("http://localhost:5000/lista_usuarios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario }),
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id_usuario));
    } catch (err) {
      setError(err.message);
    }
  };

  const editarRolUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoNombre(usuario.nombre);
    setNuevoCorreo(usuario.correo);
    setNuevoRol(usuario.rol);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setNuevoNombre("");
    setNuevoCorreo("");
    setNuevoRol("");
  };

  const actualizarUsuario = async () => {
    if (!usuarioEditando || !sessionId) {
      setError("Faltan datos o sesión");
      return;
    }

    try {
      // 1. Actualizar nombre y correo
      const res1 = await fetch(`http://localhost:5000/usuarios/${usuarioEditando.id_usuario}/datos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nuevoNombre,
            email: nuevoCorreo,
          }),
        });
      if (!res1.ok) throw new Error("Error al actualizar nombre o correo");

      // 2. Actualizar rol
      // 2. Solo actualiza el rol si cambió
        if (nuevoRol !== usuarioEditando.rol) {
          const res2 = await fetch(`http://localhost:5000/usuarios/${usuarioEditando.id_usuario}/rol`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rol: nuevoRol }),
          });

          if (!res2.ok) throw new Error("Error al actualizar rol");
        }


      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === usuarioEditando.id_usuario
            ? { ...u, nombre: nuevoNombre, correo: nuevoCorreo, rol: nuevoRol }
            : u
        )
      );
      cerrarModal();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6" }}>
      <MenuSuperiorAdmin />
      <Box maxWidth="lg" mx="auto" p={4}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={4}>
          Gestión de Usuarios
        </Typography>

        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Buscar por nombre o correo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Mostrar</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                label="Mostrar"
              >
                {[5, 10, 25, 50].map((num) => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading && <Typography align="center">Cargando usuarios...</Typography>}
        {error && <Typography color="error" align="center">{error}</Typography>}

        {!loading && !error && (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsuarios.slice(0, itemsPerPage).map((usuario) => (
                  <TableRow key={usuario.id_usuario} hover>
                    <TableCell>{usuario.id_usuario}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => editarRolUsuario(usuario)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => eliminar_usuario(usuario.id_usuario)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* MODAL DE EDICIÓN */}
        <Dialog open={modalAbierto} onClose={cerrarModal}>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Nombre"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Correo"
              type="email"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Rol</InputLabel>
              <Select
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value)}
                label="Rol"
              >
                <MenuItem value="usuario">usuario</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
            <Button onClick={actualizarUsuario} variant="contained" color="success">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ListaUsuarios;
