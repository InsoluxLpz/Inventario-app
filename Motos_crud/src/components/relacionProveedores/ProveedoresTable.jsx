import React, { useState, useEffect } from "react";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControlLabel, Switch, Button, } from "@mui/material";
import AddchartIcon from '@mui/icons-material/Addchart';
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";
import { obtenerProveedores, ActualizarStatus } from "../../api/proovedoresApi";
import { NavBar } from "../NavBar";
import { AgregarProveedoresModal } from "./AgregarProveedoresModal";
import { EditarProveedoresModal } from "./EditarProveedoresModal";

export const ProveedoresTable = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const agregarProveedorHandler = (nuevoProveedor) => {
    setProveedores((prevProveedor) => [...prevProveedor, nuevoProveedor]);
  };

  const handleOpenModalAgregar = () => {
    setOpenModalAgregar(true);
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
  };

  const handleOpenModalEditar = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setOpenModalEditar(true);
  };
  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setProveedorSeleccionado(null);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const data = await obtenerProveedores();
      if (data) {
        setProveedores(data);
      }
    } catch (error) {
      console.error("Error en la peticion al obtener proveedores");
    }
  };
  // * actualizar la lista
  const actualizarLista = (proveedorActualizado) => {
    setProveedores((prevProveedor) =>
      prevProveedor.map((m) =>
        m.id === proveedorActualizado.id ? proveedorActualizado : m
      )
    );
  };

  // * actualizar status para que desaparezca de la lista pero no se elimine
  const handleActualizarStatus = (id) => {
    ActualizarStatus(id, (idActualizado) => {
      setProveedores((proveedoresActuales) =>
        proveedoresActuales.map((proveedor) =>
          proveedor.id === idActualizado
            ? { ...proveedor, status: 0 }
            : proveedor
        )
      );
    });
  };

  // * buscador
  const filteredProveedores = proveedores.filter((proveedor) => {
    const matchesSearchTerm = proveedor.nombre_proveedor
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || proveedor.status !== 0;

    return matchesSearchTerm && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#5d6d7e"; // Amarillo claro para "inactiva"
      default:
        return "transparent"; // Fondo transparente si no coincide
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#d6dbdf", minHeight: "100vh" }}>
        <NavBar onSearch={setSearchTerm} />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "right", gap: "8px", }}
          onClick={handleOpenModalAgregar}>
          <AddchartIcon sx={{ fontSize: 24 }} />
          Agregar Proveedores
        </Button>

        <Box width="90%" maxWidth={2000} margin="0 auto" mt={9}>
          {/* Header alineado a la izquierda con fondo */}
          <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
            <Typography variant="h5" fontWeight="bold" color="white">
              Proveedores
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", backgroundColor: 'white' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  color="default"
                />
              }
              label="Mostrar inactivas"
            />
          </Box>

          {/* Contenedor de la tabla */}
          <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {["Empresa", "Nombre", "Teléfono Contacto", "RFC", "Teléfono Empresa", "Acciones"].map((col) => (
                      <TableCell
                        key={col}
                        sx={{
                          backgroundColor: "#d5dbdb",
                          color: "black",
                          textAlign: "center",
                          width: "16.66%",
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredProveedores.map((proveedor, index) => (
                    <TableRow
                      key={proveedor.id}
                      sx={{
                        backgroundColor: getStatusColor(proveedor.status), // Combina ambos colores
                        "&:hover": {
                          backgroundColor: "#eaecee ", // Color al pasar el mouse
                        }
                      }}
                    >
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>{proveedor.nombre_empresa}</TableCell>
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>{proveedor.nombre_proveedor}</TableCell>
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>{proveedor.telefono_contacto}</TableCell>
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>{proveedor.rfc}</TableCell>
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>{proveedor.telefono_empresa}</TableCell>
                      <TableCell sx={{ textAlign: "right", width: "16.66%" }}>
                        <IconButton sx={{ color: "black" }} onClick={() => handleOpenModalEditar(proveedor)}>
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton color="error" sx={{ marginLeft: "10px" }} onClick={() => handleActualizarStatus(proveedor.id)}>
                          <InventoryIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

        </Box>
        <AgregarProveedoresModal
          modalOpen={openModalAgregar}
          onClose={handleCloseModalAgregar}
          agregarProveedorHandler={agregarProveedorHandler}
        />
        <EditarProveedoresModal
          modalOpen={openModalEditar}
          onClose={handleCloseModalEditar}
          proveedor={proveedorSeleccionado}
          actualizarLista={actualizarLista}
        />
      </Box>
    </>
  );
};
