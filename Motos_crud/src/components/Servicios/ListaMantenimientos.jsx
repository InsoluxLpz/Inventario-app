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
import { EliminarMantenimiento, ObtenerMantenimientos, ObtenerServicios, } from "../../api/ServiciosApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { RealizarMantenimiento } from "./RealizarMantenimiento";
import { EditarMantenimiento } from "./EditarMantenimiento";
import { obtenerProductos } from "../../api/productosApi";
import { obtenerMotos } from "../../api/motosApi";
import InfoIcon from "@mui/icons-material/Info";
import { VerMantenimientoCancelado } from "./VerMantenimientoCancelado";
import SearchIcon from '@mui/icons-material/Search';
import { Grid } from "@mui/material";
import Select from "react-select";

export const ListaMantenimientos = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState(null);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [motos, setMotos] = useState([]);
  const [filtro, setFiltro] = useState({
    fecha_inicio: "",
    fecha_final: "",
    servicio: "",
  });

  const handleOpenModalAgregar = () => setOpenModalAgregar(true);
  const handleCloseModalAgregar = () => setOpenModalAgregar(false);

  const handleOpenModalEditar = (mantenimiento) => {
    setOpenModalEditar(true);
    setMantenimientoSeleccionado(mantenimiento);
  };
  const handleCloseModalEditar = () => setOpenModalEditar(false);

  const handleOpenModalInfo = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setOpenModalInfo(true);
  };
  const handleCloseModalInfo = () => setOpenModalInfo(false);

  const fetchMotos = async () => {
    const data = await obtenerMotos();
    if (data) setMotos(data);
  };

  const fetchServicios = async () => {
    const data = await ObtenerServicios();
    if (data) setServicios(data);
  };

  const fetchProducto = async () => {
    const data = await obtenerProductos();
    if (data) setProductos(data);
  };

  const handleEliminarMantenimiento = async (id) => {
    await EliminarMantenimiento(id, (idEliminado) => {
      setMantenimientos((mantenimientosActuales) =>
        mantenimientosActuales.filter(
          (mantenimiento) => mantenimiento.id !== idEliminado
        )
      );
    });
    cargarMantenimientos();
  };

  const actualizarLista = (mantenimientoActualizado) => {
    setMantenimientos((prevMantenimientos) =>
      prevMantenimientos.map((m) =>
        m.id === mantenimientoActualizado.id ? mantenimientoActualizado : m
      )
    );
  };

  const cargarMantenimientos = async () => {
    const data = await ObtenerMantenimientos({ filtro });
    if (data) {
      const mantenimientosAdaptados = data.map((servicio) => ({
        id: servicio.id,
        moto_inciso: servicio.moto_inciso || "Desconocido",
        idMoto: servicio.idMoto || "",
        idAutorizo: servicio.idAutorizo || "",
        fecha_inicio: servicio.fecha_inicio,
        fecha_cancelacion: servicio.fecha_cancelacion,
        comentario: servicio.comentario,
        costo_total: parseFloat(servicio.costo_total) || 0,
        servicios: servicio.servicios || [],
        productos: servicio.productos || [],
        odometro: servicio.odometro || 0,
        status: servicio.status,
        nombre: servicio.nombre,
      }));
      setMantenimientos(mantenimientosAdaptados);
    }
  };


  useEffect(() => {
    cargarMantenimientos();
    fetchMotos();
    fetchProducto();
    fetchServicios();
  }, []);

  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  const opcionesServicios = [...servicios]
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((serv) => ({ value: serv.id, label: serv.nombre }));

  const miniDrawerWidth = 50;

  return (
    <>
      <Box
        sx={{ backgroundColor: "#f2f3f4", minHeight: "100vh", paddingBottom: 4, transition: "margin 0.3s ease-in-out", marginLeft: `${miniDrawerWidth}px`, }}
      >
        <NavBar />

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 3, marginLeft: 12 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">

              <Grid item xs={12} sm={4} md={3}>
                <Select
                  name="servicios"
                  options={opcionesServicios}
                  isMulti
                  placeholder="SELECCIONA"
                  value={opcionesServicios.filter(s => filtro.servicio.includes(s.value))}
                  onChange={(selectedOptions) =>
                    setFiltro({ ...filtro, servicio: selectedOptions.map((s) => s.value) })
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "45px",
                      height: "55px",
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }),
                  }}
                />

              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  label="Fecha desde"
                  type="date"
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  name="fecha_inicio"
                  value={filtro.fecha_inicio}
                  onChange={(e) => setFiltro({ ...filtro, fecha_inicio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  label="Fecha hasta"
                  type="date"
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  name="fecha_final"
                  value={filtro.fecha_final}
                  onChange={(e) => setFiltro({ ...filtro, fecha_final: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#196f3d", color: "white", ":hover": { opacity: 0.7 }, borderRadius: "8px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "8px" }} onClick={cargarMantenimientos}>
                  <SearchIcon sx={{ fontSize: 24 }} />
                  Buscar
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, right: 20, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", marginRight: 8 }}
                  onClick={handleOpenModalAgregar}>
                  <AddchartIcon sx={{ fontSize: 24 }} />
                  Agregar Mantenimiento
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box width="90%" maxWidth={2000} margin="0 auto" mt={3}>

          <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
            <Typography variant="h5" color="white">
              Lista de Mantenimientos
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", maxWidth: "2000px", margin: "0 auto", backgroundColor: "white", padding: 2 }}>
            <TableContainer sx={{ maxHeight: 800, backgroundColor: "#ffff ", border: "1px solid #d7dbdd", borderRadius: "2px" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {["Vehiculo", "Servicio(s)", "Refacciones Almacen", "Fecha de Inicio", "Comentario", "Costo Total", "status", "Acciones"].map((header) => (
                      <TableCell key={header} align="center" sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7", color: "black", textAlign: "center", width: "16.66%" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mantenimientos.length > 0 ? (
                    mantenimientos.map((mantenimiento) => (
                      <TableRow
                        key={mantenimiento.id}
                        sx={{

                          "&:hover": {
                            backgroundColor: "#eaecee ",
                          },
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
                          {formatearDinero(mantenimiento.costo_total)}
                        </TableCell>
                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", fontWeight: "bold", color: mantenimiento.status === 0 ? "red" : "green" }}>
                          {mantenimiento.status === 0 ? "Cancelado" : "Activo"}
                        </TableCell>

                        <TableCell align="center" sx={{ textAlign: "right", width: "16.66%" }}>
                          {mantenimiento.status === 1 ? (
                            <>
                              <IconButton
                                variant="contained"
                                sx={{ color: "black" }}
                                onClick={() => handleOpenModalEditar(mantenimiento)}
                              >
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
                            </>
                          ) : (
                            <IconButton
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenModalInfo(mantenimiento)}
                            >
                              <InfoIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          )}
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
              mantenimiento={mantenimientoSeleccionado}
              listaMotos={motos}
              listaProductos={productos}
              listaServicios={servicios}
            />

            <VerMantenimientoCancelado
              modalOpen={openModalInfo}
              onClose={handleCloseModalInfo}
              mantenimiento={mantenimientoSeleccionado}
              listaMotos={motos}
              listaServicios={servicios}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
};
