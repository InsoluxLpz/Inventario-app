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
import { Box, Button, IconButton, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { EliminarMantenimiento, ObtenerMantenimientos, ObtenerServicios, } from "../../api/ServiciosApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { RealizarMantenimiento } from "./RealizarMantenimiento";
import { EditarMantenimiento } from "./EditarMantenimiento";
import { obtenerProveedores } from "../../api/proveedoresApi";
import { obtenerProductos } from "../../api/productosApi";

export const ListaMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
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

  const handleOpenModalEditar = () => {
    setOpenModalEditar(true);
  };
  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
  };

  const fetchProveedor = async () => {
    const data = await obtenerProveedores();
    if (data) {
      setProveedores(data);
    }
  };

  const fetchServicios = async () => {
    const data = await ObtenerServicios();
    if (data) {
      setServicios(data);
    }
  };

  const fetchProducto = async () => {
    const data = await obtenerProductos();
    if (data) {
      setProductos(data);
    }
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
      const mantenimientosAdaptados = data.map((servicio) => ({
        id: servicio.id,
        moto_inciso: servicio.moto_inciso || "Desconocido",
        fecha_inicio: servicio.fecha_inicio,
        comentario: servicio.comentario,
        costo: parseFloat(servicio.costo_total) || 0, // Conversión segura a número
        servicios: servicio.servicios || [],
        productos: servicio.productos || [],
      }));

      setMantenimientos(mantenimientosAdaptados);
    }
  };


  useEffect(() => {
    cargarMantenimientos();
    fetchProducto();
    fetchProveedor();
    fetchServicios();
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

  const miniDrawerWidth = 50;

  return (
    <>
      <Box
        sx={{ backgroundColor: "#f2f3f4", minHeight: "100vh", paddingBottom: 4, transition: "margin 0.3s ease-in-out", marginLeft: `${miniDrawerWidth}px`, }}
      >
        <NavBar />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", }} onClick={handleOpenModalAgregar}
        >
          <AddchartIcon sx={{ fontSize: 24 }} />
          Agregar Mantenimiento
        </Button>

        {/* <Box display="flex" justifyContent="center" gap={2} my={2}>
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
        >
        </Box> */}

        <Box width="90%" maxWidth={2000} margin="0 auto" mt={10}>
          <Box
            sx={{
              backgroundColor: "#1f618d",
              padding: "10px 20px",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Typography variant="h5" color="white">
              Lista de Mantenimientos
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", maxWidth: "2000px", margin: "0 auto", backgroundColor: "white", padding: 2 }}>
            <TableContainer sx={{ maxHeight: 800, backgroundColor: "#ffff ", border: "1px solid #d7dbdd", borderRadius: "2px" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {["Vehiculo", "Servicio(s)", "Refacciones Almacen", "Fecha de Inicio", "Comentario", "Costo Total", "Acciones"].map((header) => (
                      <TableCell key={header} align="center" sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7", color: "black", textAlign: "center", width: "16.66%" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mantenimientos.length > 0 ? (
                    mantenimientos.map((mantenimiento) => (
                      <TableRow key={mantenimiento.id} sx={{
                        backgroundColor: '#ffff', "&:hover": {
                          backgroundColor: "#eaecee ",
                        }
                      }}
                      >
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {mantenimiento.moto_inciso}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {mantenimiento.servicios.length > 0
                            ? mantenimiento.servicios.map((s) => s.nombre).join(", ")
                            : "N/A"}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {mantenimiento.productos.length > 0
                            ? mantenimiento.productos.map((p) => p.nombre).join(", ")
                            : "N/A"}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {new Date(mantenimiento.fecha_inicio).toLocaleDateString("es-MX")}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {mantenimiento.comentario}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {formatearDinero(mantenimiento.costo)}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          <IconButton variant="contained" sx={{ color: "black" }} onClick={handleOpenModalEditar}>
                            <EditIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton
                            variant="contained"
                            color="error"
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleEliminarMantenimiento(mantenimiento.id)}
                          >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
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

            <EditarMantenimiento
              modalOpen={openModalEditar}
              onClose={handleCloseModalEditar}
              mantenimiento={mantenimientos}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
};
