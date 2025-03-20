import React, { useState, useEffect } from "react";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import { NavBar } from "../NavBar";
import { cargarListasMovimientosXProductosDetalles } from "../../api/almacenProductosApi";
import FeedIcon from "@mui/icons-material/Feed";
import { useNavigate } from "react-router";

export const MovXProductosTable = () => {
  const navigate = useNavigate();
  const [inventario, setInventario] = useState([]);
  const [filtro, setFiltro] = useState({
    idMovimiento: "",
    fecha: "",
    nombreUsuario: "",
    idProducto: "", // <-- Agregar idProducto
  });

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      if (!filtro.idProducto) {
        console.warn("Por favor, ingresa un ID de producto.");
        return;
      }

      const data = await cargarListasMovimientosXProductosDetalles(
        filtro.idProducto
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

  const movimientosFiltrados = inventario.filter((m) => {
    const nombreUsuarioMatch =
      filtro.nombreUsuario === "" ||
      (m.nombreUsuario &&
        m.nombreUsuario
          .toLowerCase()
          .includes(filtro.nombreUsuario.toLowerCase().trim()));

    const idMovimientoMatch =
      filtro.idMovimiento === "" ||
      m.idMovimiento?.toString().includes(filtro.idMovimiento.toString());

    const fechaMatch =
      filtro.fecha === "" || m.fecha_movimiento?.includes(filtro.fecha);

    return nombreUsuarioMatch && idMovimientoMatch && fechaMatch;
  });

  return (
    <>
      <NavBar />
      <Box display="flex" justifyContent="center" gap={1} my={2} mt={3}>
        <TextField
          label="No. Movimiento"
          name="idMovimiento"
          value={filtro.idMovimiento}
          onChange={handleFiltroChange}
        />
        <TextField
          label="Filtrar por Fecha"
          name="fecha"
          type="date"
          value={filtro.fecha}
          onChange={handleFiltroChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Usuario"
          name="nombreUsuario"
          value={filtro.nombreUsuario}
          onChange={handleFiltroChange}
        />
      </Box>

      <Box display="flex" justifyContent="center" gap={1} my={2} mt={3}>
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
        <Box
          sx={{
            backgroundColor: "#1f618d",
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="white">
            Movimientos en el almacén
          </Typography>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 600, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "No. Movimiento",
                    "Fecha",
                    "Realizó Mov.",
                    "Autorizó",
                    "Detalles",
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
                {movimientosFiltrados.map((producto) => (
                  <TableRow key={producto.idMovimiento}>
                    <TableCell align="center">
                      {producto.idMovimiento}
                    </TableCell>
                    <TableCell align="center">
                      {producto.fecha_movimiento
                        ? new Date(
                            producto.fecha_movimiento
                          ).toLocaleDateString("es-MX")
                        : "Fecha no disponible"}
                    </TableCell>
                    <TableCell align="center">
                      {producto.nombreUsuario}
                    </TableCell>
                    <TableCell align="center">
                      {producto.nombreAutorizo}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: "black" }}
                        onClick={() =>
                          navigate(
                            `/detalle-movimiento/${producto.idMovimiento}`
                          )
                        }
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
    </>
  );
};
