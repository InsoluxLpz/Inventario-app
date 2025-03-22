import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
} from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import { useNavigate } from "react-router";
import { NavBar } from "../NavBar";
import { cargarListasMovimientosXProductosDetalles } from "../../api/almacenProductosApi";
import { ModalMovProductoDetalle } from "./ModalMovProductoDetalle"; // Importar el modal
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export const MovXProductosTable = () => {
  const navigate = useNavigate();
  const [inventario, setInventario] = useState([]);
  const [filtro, setFiltro] = useState({
    idMovimiento: "",
    fechaInicio: "",
    fechaFin: "",
    nombreUsuario: "",
    idProducto: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);

  const fetchInventario = async () => {
    try {
      if (!filtro.idProducto) {
        console.warn("Por favor, ingresa un ID de producto.");
        return;
      }

      const data = await cargarListasMovimientosXProductosDetalles(
        filtro.idProducto,
        filtro.fechaInicio,
        filtro.fechaFin
      );

      if (data) {
        setInventario(data);
      }
    } catch (error) {
      console.error("Error en la petición al obtener Inventario:", error);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (producto) => {
    setDetalleMovimiento(producto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDetalleMovimiento(null);
  };

  // * funcion para limpiar el filtro
  const limpiarFiltros = () => {
    setFiltro({
      idMovimiento: "",
      fechaInicio: "",
      fechaFin: "",
      nombreUsuario: "",
      idProducto: "",
    });
    setInventario([]); // Opcional: limpiar la tabla también
  };

  

  return (
    <>
      <NavBar />

      <Box display="flex" justifyContent="center" gap={1} my={2} mt={3}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#566573",
            color: "white",
            ":hover": { opacity: 0.7 },
            borderRadius: "8px",
            padding: "5px 10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={limpiarFiltros}
        >
          <CleaningServicesIcon sx={{ fontSize: 24 }} />
        </Button>
        <TextField
          label="Fecha Inicio"
          name="fechaInicio"
          type="date"
          value={filtro.fechaInicio}
          onChange={handleFiltroChange}
          InputLabelProps={{ shrink: true }}
          onFocus={(e) => e.target.showPicker()}
        />
        <TextField
          label="Fecha Fin"
          name="fechaFin"
          type="date"
          value={filtro.fechaFin}
          onChange={handleFiltroChange}
          InputLabelProps={{ shrink: true }}
          onFocus={(e) => e.target.showPicker()}
        />
        <TextField
          label="ID Producto"
          name="idProducto"
          value={filtro.idProducto}
          onChange={handleFiltroChange}
        />
        <Button variant="contained" color="primary" onClick={fetchInventario}>
          Buscar
        </Button>
      </Box>

      <Box width="90%" maxWidth={2000} margin="0 auto" mt={2}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 600, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Movimiento número",
                    "Fecha",
                    "Realizó Movimiento",
                    "Tipo de movimiento",
                    "Informe",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f4f6f7",
                        color: "black",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {inventario.map((producto) => (
                  <TableRow key={producto.idMovimiento}>
                    <TableCell align="center">
                      {producto.idMovimiento}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(producto.fecha_movimiento).toLocaleDateString(
                        "es-MX"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {producto.nombreUsuario}
                    </TableCell>
                    <TableCell align="center">
                      {producto.tipoMovimiento}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: "black" }}
                        onClick={() => handleOpenModal(producto)}
                      >
                        <FeedIcon sx={{ fontSize: 29 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Modal */}
      <ModalMovProductoDetalle
        open={openModal}
        handleClose={handleCloseModal}
        detalle={detalleMovimiento}
      />
    </>
  );
};
