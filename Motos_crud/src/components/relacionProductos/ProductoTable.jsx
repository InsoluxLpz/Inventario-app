import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { NavBar } from "../NavBar";
import { obtenerProductos, ActualizarStatus } from "../../api/productosApi";
import { EditarProductoModal } from "../relacionProductos/EditarProductoModal";
import { AgregarProductoModal } from "../relacionProductos/AgregarProductoModal";
import { useNavigate } from "react-router";

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

  const actualizarLista = (productoActualizado) => {
    setProductos((prevProductos) =>
      prevProductos.map((m) =>
        m.id === productoActualizado.id ? productoActualizado : m
      )
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

    return showInactive
      ? matchesSearch
      : matchesSearch && producto.status !== 0;
  });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={2}
        px={2}
      >
        {/* <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
          }
          label="Mostrar inactivos"
        />
      </Box>
      <Box width="90%" maxWidth={2000} margin="0 auto">
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 900, backgroundColor: "#f4f6f7" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Código",
                    "Nombre",
                    "Grupo",
                    "Unidad de medida",
                    "Precio",
                    "Descripción",
                    "Acciones",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#a93226",
                        color: "white",
                      }}
                    >
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
                    <TableCell align="center">
                      {producto.unidad_medida}
                    </TableCell>
                    <TableCell align="center">{producto.precio}</TableCell>
                    <TableCell align="center">{producto.descripcion}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{
                          backgroundColor: "#f39c12",
                          ":hover": {
                            backgroundColor: "#f8c471",
                            opacity: 0.7,
                          },
                        }}
                        onClick={() => {
                          setProductoSeleccionado(producto);
                          setOpenModalEditar(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        sx={{ marginLeft: "10px" }}
                        onClick={() => handleActualizarStatus(producto.id)}
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
          sx={{
            backgroundColor: "#e74c3c",
            color: "white",
            ":hover": { opacity: 0.7 },
            position: "fixed",
            right: 50,
            bottom: 50,
          }}
          onClick={() => navigate("/AgregarProductos")}
        >
          <AddIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
      <EditarProductoModal
        modalOpen={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        producto={productoSeleccionado}
        actualizarLista={actualizarLista}
      />
      <AgregarProductoModal
        modalOpen={openModalAgregar}
        onClose={() => setOpenModalAgregar(false)}
      />
    </>
  );
};
