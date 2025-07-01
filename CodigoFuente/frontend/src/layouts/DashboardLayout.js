// src/layouts/DashboardLayout.js
import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import MenuSuperiorAdmin from '../components/MenuSuperiorAdmin';

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CssBaseline />
      {/* Menú superior personalizado */}
      <MenuSuperiorAdmin />

      {/* Contenedor central del dashboard */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;
