import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
    const matchesSearchTerm = proveedor.nombreProveedor
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive || proveedor.status !== 0; // Incluye a proveedores activos si 'showInactive' es falso

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      >
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#f4f6f7",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#a93226", textAlign: "center" }}
          >
            Lista de Proveedores
          </Typography>
          <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                    }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                    }}
                  >
                    Teléfono Contacto
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                    }}
                  >
                    RFC
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                    }}
                  >
                    Teléfono Empresa
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell>{proveedor.nombreProveedor}</TableCell>
                    <TableCell>{proveedor.telefonoContacto}</TableCell>
                    <TableCell>{proveedor.rfc}</TableCell>
                    <TableCell>{proveedor.telefonoEmpresa}</TableCell>
                    <TableCell>
                      <IconButton
                        variant="contained"
                        sx={{
                          backgroundColor: "#f39c12 ",
                          ":hover": {
                            backgroundColor: "#f8c471 ",
                            opacity: 0.7,
                          },
                        }}
                        onClick={() => handleOpenModalEditar(proveedor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleActualizarStatus(proveedor.id)}
                      >
                        <InventoryIcon sx={{ fontSize: 35 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <IconButton
          variant="contained"
          onClick={handleOpenModalAgregar}
          sx={{
            backgroundColor: "#e74c3c",
            color: "white",
            ":hover": { backgroundColor: "#e74c3c", opacity: 0.7 },
            position: "fixed",
            right: 50,
            bottom: 50,
          }}
          style={{
            alignSelf: "flex-end",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <AddIcon sx={{ fontSize: 40 }} />
        </IconButton>
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
    </>
  );
};
