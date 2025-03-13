// Este componente se hizo por error pero puede ser que se pida mas adelante

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
import { Box, Button, Typography, IconButton } from "@mui/material";
import { NavBar } from "../NavBar";
import { cargarListasMovimientos } from "../../api/almacenProductosApi";
import { ModalMovimientosDetalles } from "./ModalMovimientosDetalles";
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

  const handleActualizarStatus = (id) => {
    ActualizarStatusInventario(id, (idActualizado) => {
      setInventario((productosActuales) =>
        productosActuales.map((producto) =>
          producto.id === idActualizado ? { ...producto, status: 0 } : producto
        )
      );
    });
  };

  const filteredInventario = inventario.filter((producto) => {
    const matchesSearch =
      (producto.nombre?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (producto.codigo?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (producto.grupo?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    return showInactive
      ? matchesSearch
      : matchesSearch && producto.status !== 0;
  });

  //   * formato de dinero
  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

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
          Almacén
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

      <Box width="90%" maxWidth={2000} margin="0 auto" mt={10}>
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
          <TableContainer sx={{ maxHeight: 700, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "No.Movimiento",
                    "Fecha",
                    "Realizo Mov.",
                    "Autorizo",
                    "Detalles",
                    "Acciones",
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
                {filteredInventario.map((producto) => (
                  <TableRow key={producto.id}>
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
                    {/* boton para ver los detalles del movimiento ( informacion completa) */}
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: "black" }}
                        onClick={() => handleOpenModal(producto.idMovimiento)}
                      >
                        <FeedIcon sx={{fontSize: 29 }}/>
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: "black" }}
                        onClick={() => {
                          setProductoSeleccionado(producto);
                          setOpenModalEditar(true);
                        }}
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>

                      <IconButton
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleActualizarStatus(producto.id)}
                      >
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
