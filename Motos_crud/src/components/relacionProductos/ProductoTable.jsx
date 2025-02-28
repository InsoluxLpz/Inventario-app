import React, { useState, useEffect } from "react";
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
import { obtenerProductos, ActualizarStatus, obtenerUnidadMedidas, obtenerGrupos } from "../../api/productosApi";
import { EditarProductoModal } from "../relacionProductos/EditarProductoModal";
import { AgregarProductoModal } from "./AgregarProductoModal";
import AddchartIcon from '@mui/icons-material/Addchart';
import InventoryIcon from "@mui/icons-material/Inventory";
import { obtenerProveedores } from "../../api/proveedoresApi";

export const ProductoTable = () => {
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [unidadMedida, setUnidadMedida] = useState([]);

  const fetchProductos = async () => {
    try {
      const data = await obtenerProductos();
      console.log("Productos recibidos en el frontend:", data);
      if (data) {
        setProductos(data);
      }
    } catch (error) {
      console.error("Error en la petición al obtener Productos");
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
    const data = await obtenerProveedores([]);
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

    return showInactive ? matchesSearch : matchesSearch && producto.status !== 0;
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

  return (
    <>
      <NavBar onSearch={setSearchTerm} />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1f618d",
          color: "white",
          ":hover": { opacity: 0.7 },
          position: "fixed",
          right: 50,
          top: 80,
          borderRadius: "8px",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={handleModalAgregar}
      >
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
                  {["Código", "Nombre", "Grupo", "Unidad de medida", "Proveedor", "Precio", "Descripción", "Acciones"].map((header) => (
                    <TableCell key={header} align="center" sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7", color: "black", textAlign: "right" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell align="center" sx={{ textAlign: "right" }}>
                      {producto.codigo}
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: "right" }}>
                      {producto.nombre}
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: "right" }}>
                      {producto.grupo} {/* Mostrar el nombre del grupo */}
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: "right" }}>
                      {producto.unidad_medida} {/* Mostrar la unidad de medida */}
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: "right" }}>
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
    </>
  );
};
