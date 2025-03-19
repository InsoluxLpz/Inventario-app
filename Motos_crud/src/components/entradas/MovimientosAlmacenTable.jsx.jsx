import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
import { cargarListasMovimientos } from "../../api/almacenProductosApi";
import { ModalMovimientosDetalles } from "./ModalMovimientosDetalles";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import FeedIcon from "@mui/icons-material/Feed";
import { EditarProductoAlmacenModal } from "./EditarProductoAlmacenModal";
import { useNavigate } from "react-router";

export const MovimientosAlmacenTable = () => {
  const navigate = useNavigate();

  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // * modal movimientos detalles
  const [openModal, setOpenModal] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  // * filtro por idMovimiento, Fecha y quien realizo el movimiento
  const [filtro, setFiltro] = useState({
    idMovimiento: "",
    fecha: "",
    nombreUsuario: "",
  });

  const handleOpenModal = (id) => {
    setSelectedMovimiento(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMovimiento(null);
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      const data = await cargarListasMovimientos();
      console.log("datos de la peticion inventario", data);
      if (data) {
        setInventario(data);
      }
    } catch (error) {
      console.error("Error en la petición al obtener Inventario");
    }
  };

  const actualizarLista = (productoActualizado) => {
    setInventario((prevInventario) =>
      prevInventario.map((item) =>
        item.id === productoActualizado.id ? productoActualizado : item
      )
    );
  };

  // * funcion para los filtros
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
    console.log("filtro", filtro);

    const idMovimientoMatch =
      filtro.idMovimiento === "" ||
      m.idMovimiento?.toString().includes(filtro.idMovimiento.toString());

    const fechaMatch =
      filtro.fecha === "" || m.fecha_movimiento?.includes(filtro.fecha);

    return nombreUsuarioMatch && idMovimientoMatch && fechaMatch;
  });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "16px", // Espacio entre los botones
          position: "fixed",
          right: 50,
          top: 80,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1f618d",
            color: "white",
            ":hover": { opacity: 0.7 },
            borderRadius: "8px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/almacen/ProductoAlmacenTable")}
        >
          <WarehouseIcon sx={{ fontSize: 24 }} />
          INVENTARIO
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1f618d",
            color: "white",
            ":hover": { opacity: 0.7 },
            borderRadius: "8px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/almacen/Entradas")}
        >
          <PlaylistAddCircleIcon sx={{ fontSize: 24 }} />
          Agregar Entradas
        </Button>
      </div>

      <Box display="flex" justifyContent="center" gap={1} my={2} mt={10}>
        <TextField
          label="No.Movimiento"
          name="idMovimiento"
          value={filtro.idMovimiento}
          onChange={handleFiltroChange}
        />
        <TextField
          label="Filtrar por"
          name="fecha"
          type="date"
          value={filtro.fecha}
          onChange={handleFiltroChange}
          onFocus={(e) => (e.target.showPicker ? e.target.showPicker() : null)} 
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Usuario"
          name="nombreUsuario"
          value={filtro.nombreUsuario}
          onChange={handleFiltroChange}
        />
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
            Movimientos en el almacen
          </Typography>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 600, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "No.Movimiento",
                    "Fecha",
                    "Realizo Mov.",
                    "Autorizo",
                    "Detalles",
                    // "Acciones",
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
                        onClick={() => handleOpenModal(producto.idMovimiento)}
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

      <EditarProductoAlmacenModal
        modalOpen={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        producto={productoSeleccionado}
        actualizarLista={actualizarLista}
      />

      <ModalMovimientosDetalles
        open={openModal}
        onClose={handleCloseModal}
        idMovimiento={selectedMovimiento}
      />
    </>
  );
};
