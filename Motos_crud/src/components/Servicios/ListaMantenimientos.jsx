import React, { useEffect, useState } from "react";
import AddchartIcon from "@mui/icons-material/Addchart";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import {
  EliminarMantenimiento,
  ObtenerMantenimientos,
} from "../../api/ServiciosApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { RealizarMantenimiento } from "./RealizarMantenimiento";

export const ListaMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [filtro, setFiltro] = useState({
    vehiculo: "",
    fecha: "",
    servicio: "",
  });

  const handleOpenModalAgregar = () => {
    setOpenModalAgregar(true);
  };
  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
  };

  const handleEliminarMantenimiento = (id) => {
    EliminarMantenimiento(id, (idEliminado) => {
      setMantenimientos((MantenimientosActuales) =>
        MantenimientosActuales.filter(
          (mantenimiento) => mantenimiento.id !== idEliminado
        )
      );
    });
  };

  const actualizarLista = (mantenimientoActualizado) => {
    setMantenimientos((prevMantenimientos) =>
      prevMantenimientos.map((m) =>
        m.id === mantenimientoActualizado.id ? mantenimientoActualizado : m
      )
    );
  };

  const cargarMantenimientos = async () => {
    const data = await ObtenerMantenimientos();
    if (data) {
      setMantenimientos(data);
      console.log(data);
    }
  };

  useEffect(() => {
    cargarMantenimientos();
  }, []);

  // * filtro para buscar por vehiculo fecha o servicio
  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const mantenimientosFiltrados = mantenimientos.filter(
    (m) =>
      (m.vehiculo?.toLowerCase() || "").includes(filtro.vehiculo.toLowerCase()) &&
      (m.fecha_inicio || "").includes(filtro.fecha) &&
      (m.servicio?.toLowerCase() || "").includes(filtro.servicio.toLowerCase())
  );
  

  //   * formato de dinero
  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  return (
    <>
      <NavBar />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1f618d",
          color: "white",
          ":hover": { opacity: 0.7 },
          position: "fixed",
          right: 50,
          top: 80,
          borderRadius: "8px",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={handleOpenModalAgregar}
      >
        <AddchartIcon sx={{ fontSize: 24 }} />
        Agregar Mantenimiento
      </Button>
      
      <Box display="flex" justifyContent="center" gap={2} my={2}>
        <TextField
          label="Vehículo"
          name="vehiculo"
          value={filtro.vehiculo}
          onChange={handleFiltroChange}
        />
        <TextField
          label="Filtrar por"
          name="fecha"
          type="date"
          value={filtro.fecha}
          onChange={handleFiltroChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Servicio"
          name="servicio"
          value={filtro.servicio}
          onChange={handleFiltroChange}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: 4 }}
      ></Box>

      <Box width="90%" maxWidth={2000} margin="0 auto" mt={4}>
        {/* Header alineado a la izquierda con fondo */}
        <Box
          sx={{
            backgroundColor: "#1f618d",
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="white">
            Lista de Mantenimientos
          </Typography>
        </Box>

        {/* Contenedor de la tabla */}
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7 " }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Vehiculo
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Servicios(s)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Refacciones de almacen
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Fecha Inicio
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Comentario
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Costo Partes/Refacciones
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Costo Total
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black", padding: "8px", textAlign: "right" }}
                  >
                    Opciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mantenimientosFiltrados.length > 0 ? (
                  mantenimientosFiltrados.map((mantenimiento) => (
                    <TableRow key={mantenimiento.id}>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {mantenimiento.vehiculo}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {mantenimiento.servicio}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {mantenimiento.refacciones_almacen}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {mantenimiento.fecha_inicio
                          ? new Date(
                            mantenimiento.fecha_inicio
                          ).toLocaleDateString("es-MX")
                          : "Fecha no disponible"}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {mantenimiento.comentario}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {formatearDinero(mantenimiento.costo_refacciones)}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {formatearDinero(mantenimiento.costo_total)}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        <IconButton variant="contained" sx={{ color: "black" }}>
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton
                          variant="contained"
                          color="error"
                          style={{ marginLeft: "10px" }}
                          onClick={() =>
                            handleEliminarMantenimiento(mantenimiento.id)
                          }
                        >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No hay mantenimientos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <RealizarMantenimiento
            modalOpen={openModalAgregar}
            onClose={handleCloseModalAgregar}
          />
        </Paper>
      </Box>
    </>
  );
};
