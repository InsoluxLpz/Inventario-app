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
  styled,
  CircularProgress 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FeedIcon from "@mui/icons-material/Feed";
import { useNavigate } from "react-router";
import { NavBar } from "../NavBar";
import {
  cargarListasMovimientosXProductosDetalles,
  buscarProductoPorNombre,
} from "../../api/almacenProductosApi";
import { ModalMovProductoDetalle } from "./ModalMovProductoDetalle"; // Importar el modal
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
// * componente para el indicador de carga
import IndicadorCarga from "../IndicadorCarga";
import { useSpring, animated } from "@react-spring/web";

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

  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  // * indicador de progreso en carga de tabla
  const [progreso, setProgreso] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // * peticion con el indicador de car4ga
  const fetchInventario = async () => {
    try {
      if (!filtro.idProducto) {
        console.warn("Por favor, ingresa un ID de producto.");
        return;
      }
      setIsLoading(true); // Inicia el indicador de carga
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
    } finally {
      setIsLoading(false); // Finaliza el indicador de carga
      setProgreso(100);
      setTimeout(() => setProgreso(0), 500); // Oculta el indicador después de un pequeño retraso
    }
  };
  
  // * Selección de producto desde el modal
  const handleSelectProducto = (idProducto) => {
    setFiltro({ ...filtro, idProducto });
    setOpenSearchModal(false);
  };

  // * Abrir modal de detalles
  const handleOpenDetailModal = (producto) => {
    setDetalleMovimiento(producto);
    setOpenDetailModal(true);
  };

  // * Búsqueda de productos por nombre
  const handleSearchProductos = async () => {
    try {
      if (!busqueda.trim()) {
        return Swal.fire(
          "Atención",
          "Ingresa un nombre para buscar.",
          "warning"
        );
      }
      const data = await buscarProductoPorNombre(busqueda);
      setProductos(data || []);
    } catch (error) {
      console.error("Error al buscar productos:", error);
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

  // * diseño de carga en las tablas
  const styles = useSpring({
    from: { opacity: 0, transform: "translateY(50px)", filter: "blur(10px)" },
    to: { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
    config: { tension: 500, friction: 30 },
  });

  return (
    <>
      <NavBar />

      <animated.div style={styles}>
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
            label="No. Producto"
            name="idProducto"
            value={filtro.idProducto}
            onChange={handleFiltroChange}
            InputProps={{
              endAdornment: (
                <IconButton
                  color="primary"
                  onClick={() => setOpenSearchModal(true)}
                >
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button variant="contained" color="primary" onClick={fetchInventario}>
            Buscar
          </Button>
        </Box>

        <Box width="85%" maxWidth={1300} margin="0 auto" mt={2}>
          <Box
            sx={{
              backgroundColor: "#1f618d",
              padding: "10px 20px",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="white">
              Movimientos por producto
            </Typography>
          </Box>
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
                        align="left"
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
                      <TableCell align="left">
                        {producto.idMovimiento}
                      </TableCell>
                      <TableCell align="left">
                        {new Date(producto.fecha_movimiento).toLocaleDateString(
                          "es-MX"
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {producto.nombreUsuario}
                      </TableCell>
                      <TableCell align="left">
                        {producto.tipoMovimiento}
                      </TableCell>
                      <TableCell align="left">
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
            <IndicadorCarga progreso={progreso} cargando={isLoading} />
          </Paper>
        </Box>

        {/* Modal de búsqueda de productos */}
        <Modal open={openSearchModal} onClose={() => setOpenSearchModal(false)}>
          <Box
            p={2}
            bgcolor="white"
            margin="auto"
            mt="10%"
            width={400}
            borderRadius={2}
          >
            <Typography variant="h6" mb={2} textAlign="center">
              BUSCAR PRODUCTO POR NOMBRE
            </Typography>
            <TextField
              label="Nombre del producto"
              fullWidth
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchProductos();
                }
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearchProductos}
              sx={{ mt: 2 }}
            >
              Buscar
            </Button>
            {productos.map((prod) => (
              <Button
                key={prod.idProducto}
                variant="outlined"
                fullWidth
                onClick={() => handleSelectProducto(prod.idProducto)}
                sx={{ mt: 1 }}
              >
                {prod.nombre}
              </Button>
            ))}
          </Box>
        </Modal>

        {/* Modal */}
        <ModalMovProductoDetalle
          open={openModal}
          handleClose={handleCloseModal}
          detalle={detalleMovimiento}
        />
      </animated.div>
    </>
  );
};
