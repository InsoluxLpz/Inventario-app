import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, FormControlLabel, IconButton, Switch, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { obtenerProductos, ActualizarStatus } from "../../api/productosApi";
import { EditarProductoModal } from "../relacionProductos/EditarProductoModal";
import { useNavigate } from "react-router";
import { AgregarProductoModal } from "./AgregarProductoModal";
import AddchartIcon from '@mui/icons-material/Addchart';
import InventoryIcon from "@mui/icons-material/Inventory";


export const ProductoTable = () => {
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await obtenerProductos();
      if (data) {
        setProductos(data);
      }
    } catch (error) {
      console.error("Error en la petición al obtener Productos");
    }
  };

  const handleModalAgregar = () => {
    setOpenModalAgregar(true);
  };
  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
  };

  const actualizarLista = (productoActualizado) => {
    setProductos((prevProductos) =>
      prevProductos.map((m) => (m.id === productoActualizado.id ? productoActualizado : m))
    );
  };

  const handleActualizarStatus = (id) => {
    ActualizarStatus(id, (idActualizado) => {
      setProductos((productosActuales) =>
        productosActuales.map((producto) =>
          producto.id === idActualizado ? { ...producto, status: 0 } : producto
        )
      );
    });
  };

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.grupo.toLowerCase().includes(searchTerm.toLowerCase());

    return showInactive ? matchesSearch : matchesSearch && producto.status !== 0;
  });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />

      <Button
        variant="contained"
        sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", }}
        onClick={handleModalAgregar}>
        <AddchartIcon sx={{ fontSize: 24 }} />
        Agregar Productos
      </Button>

      <Box width="90%" maxWidth={2000} margin="0 auto" mt={4}>
        {/* Header alineado a la izquierda con fondo */}
        <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
          <Typography variant="h5" fontWeight="bold" color="white">
            Lista de Productos
          </Typography>
        </Box>

        {/* Contenedor de la tabla */}
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 700, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Código", "Nombre", "Grupo", "Unidad de medida", "Precio", "Descripción", "Acciones"].map((header) => (
                    <TableCell key={header} align="center" sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7", color: "black" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell align="center">{producto.codigo}</TableCell>
                    <TableCell align="center">{producto.nombre}</TableCell>
                    <TableCell align="center">{producto.grupo}</TableCell>
                    <TableCell align="center">{producto.unidad_medida}</TableCell>
                    <TableCell align="center">{producto.precio}</TableCell>
                    <TableCell align="center">{producto.descripcion}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: 'black' }}
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

      <EditarProductoModal modalOpen={openModalEditar} onClose={() => setOpenModalEditar(false)} producto={productoSeleccionado} actualizarLista={actualizarLista} />

      <AgregarProductoModal modalOpen={openModalAgregar} onClose={handleCloseModalAgregar} />

    </>
  );
};
