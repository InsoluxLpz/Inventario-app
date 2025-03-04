import React, { useState, useEffect } from "react";
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
import { obtenerProductos, ActualizarStatus, obtenerUnidadMedidas, obtenerGrupos } from "../../api/productosApi";
import { EditarProductoModal } from "../relacionProductos/EditarProductoModal";
import { AgregarProductoModal } from "./AgregarProductoModal";
import AddchartIcon from '@mui/icons-material/Addchart';
import { obtenerProveedores } from "../../api/proveedoresApi";
import { Grid } from "@material-ui/core";

export const ProductoTable = () => {
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [unidadMedida, setUnidadMedida] = useState([]);

  const fetchProductos = async () => {
    const data = await obtenerProductos();
    if (data) {
      setProductos(data);
    }

  };

  const fetchGrupos = async () => {
    const data = await obtenerGrupos();
    if (data) {
      setGrupos(data);
    }
  };

  const fetchUnidadMedida = async () => {
    const data = await obtenerUnidadMedidas();
    if (data) {
      setUnidadMedida(data);
    }
  };

  const fetchProveedor = async () => {
    const data = await obtenerProveedores([])
    if (data) {
      setProveedores(data);
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
      prevProductos.map((m) => (m.idProducto === productoActualizado.idProducto ? productoActualizado : m))
    );
  };

  const handleActualizarStatus = (id) => {
    ActualizarStatus(id, (idActualizado) => {
      setProductos((productosActuales) =>
        productosActuales.map((producto) =>
          producto.idProducto === idActualizado ? { ...producto, status: 0 } : producto
        )
      );
    });
  };

  const filteredProductos = productos.filter((producto) => {
    const nombre = producto.nombre ? producto.nombre.toLowerCase() : "";
    const codigo = producto.codigo ? producto.codigo.toLowerCase() : "";
    const grupo = producto.grupo ? producto.grupo.toString().toLowerCase() : "";

    const matchesSearch =
      nombre.includes(searchTerm.toLowerCase()) ||
      codigo.includes(searchTerm.toLowerCase()) ||
      grupo.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // * formato de dinero 
  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  useEffect(() => {
    fetchProductos();
    fetchGrupos();
    fetchUnidadMedida();
    fetchProveedor();
  }, []);

  const miniDrawerWidth = 50;

  return (
    <>
      <Box
        sx={{ backgroundColor: "#f2f3f4", minHeight: "100vh", paddingBottom: 4, transition: "margin 0.3s ease-in-out", marginLeft: `${miniDrawerWidth}px` }}
      >
        <NavBar onSearch={setSearchTerm} />
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ maxWidth: 1200 }}>
            <Grid item xs={12} sm={8} display="flex" justifyContent="flex-start">
              <TextField
                label="Buscar por nombre"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 500, backgroundColor: "white", marginLeft: 12 }}
                InputProps={{
                  sx: { height: "40px" }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
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
                  marginLeft: 39
                }}
                onClick={handleModalAgregar}
              >
                <AddchartIcon sx={{ fontSize: 24 }} />
                Agregar Productos
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box width="90%" maxWidth={2000} margin="0 auto" mt={2}>
          <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
            <Typography variant="h5" color="white">
              Lista de Productos
            </Typography>
          </Box>

          <Paper sx={{ width: "100%", maxWidth: "2000px", margin: "0 auto", backgroundColor: "white", padding: 2 }}>
            <TableContainer sx={{ maxHeight: 700, backgroundColor: "#ffff", border: "1px solid #d7dbdd", borderRadius: "2px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Código", "Nombre", "Grupo", "Unidad de medida", "Proveedor", "Precio", "Descripción", "Acciones"].map((header) => (
                      <TableCell key={header} align="center" sx={{ backgroundColor: "#f4f6f7", color: "black", textAlign: "center", width: "16.66%", fontWeight: "bold" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProductos.map((producto) => (
                    <TableRow key={producto.id} sx={{
                      backgroundColor: '#ffff', "&:hover": {
                        backgroundColor: "#eaecee ",
                      }
                    }}
                    >
                      <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", }}>
                        {producto.codigo}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", }}>
                        {producto.nombre}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", }}>
                        {producto.grupo}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", }}>
                        {producto.unidad_medida}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right", width: "16.66%", }}>
                        {Array.isArray(producto.proveedores) && producto.proveedores.length > 0
                          ? producto.proveedores.map((prov) => prov.nombre).join(", ")
                          : "Sin proveedores"}
                      </TableCell>

                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {formatearDinero(producto.precio)}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        {producto.descripcion}
                      </TableCell>
                      <TableCell align="center" sx={{ textAlign: "right" }}>
                        <IconButton
                          sx={{ color: 'black' }}
                          onClick={() => {
                            setProductoSeleccionado(producto);
                            setOpenModalEditar(true);
                          }}
                        >
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <EditarProductoModal
          modalOpen={openModalEditar}
          onClose={() => setOpenModalEditar(false)}
          producto={productoSeleccionado}
          actualizarLista={actualizarLista}
          listagrupos={grupos}
          unidadMedida={unidadMedida}
          ListaProveedores={proveedores}
        />

        <AgregarProductoModal
          modalOpen={openModalAgregar}
          onClose={handleCloseModalAgregar}
          grupos={grupos}
          unidadMedida={unidadMedida}
        />
      </Box >
    </>
  );
};  