import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import { NavBar } from "../NavBar";
// import { ModalInventarioDetalles } from "../relacionInventario/ModalInventarioDetalles";
import { cargarListasCampos } from "../../api/almacenProductosApi";
import { useNavigate } from "react-router";
import { MovXProductosTable } from "./MovXProductosTable";

export const ProductoAlmacenTable = () => {
  const navigate = useNavigate();

  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // * modal para inventario detalle
  // const [openModal, setOpenModal] = useState(false);
  // const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  // const [showDetalles, setShowDetalles] = useState(false);
  // const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  //  * filtro para el inventario
  const [filtro, setFiltro] = useState({
    codigo: "",
    fecha: "",
    unidadMedida: "",
    nombreProducto: "",
  });

  // * funcion para el modal de el icono de detalles del movimiento en el inventario
  // const handleOpenModal = () => {
  //   setSelectedMovimiento(id);
  //   setOpenModal(true);
  // }

  // const handleCloseModal =  () => {
  //   setOpenModal(false);
  //   setSelectedMovimiento(null);
  // }

  // * peticion
  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      const data = await cargarListasCampos();
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

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const filteredInventario = inventario.filter((m) => {
    // Comparar por nombre del producto
    const nombreProductoMatch =
      filtro.nombreProducto === "" ||
      (m.nombreProducto &&
        m.nombreProducto
          .toLowerCase()
          .includes(filtro.nombreProducto.toLowerCase().trim()));

    const codigoMatch =
      filtro.codigo === "" ||
      (m.codigo &&
        m.codigo.toLowerCase().includes(filtro.codigo.toLowerCase().trim()));

    const unidadMedidaMatch =
      filtro.unidadMedida === "" ||
      (m.unidadMedida &&
        m.unidadMedida
          .toLowerCase()
          .includes(filtro.unidadMedida.toLowerCase()));

    const fechaMatch =
      filtro.fecha === "" ||
      (m.fecha_movimiento && m.fecha_movimiento.includes(filtro.fecha));

    return (
      nombreProductoMatch && codigoMatch && unidadMedidaMatch && fechaMatch
    );
  });

  // *  funcion para ordenar alfabeticamente
  const sortedInventario = [...filteredInventario].sort((a, b) =>
    a.nombreProducto.localeCompare(b.nombreProducto)
  );

  return (
    <>
      <NavBar onSearch={setSearchTerm} />
  
      <Box display="flex" justifyContent="center" gap={1} my={2} mt={5}>
        <TextField
          label="Código"
          name="codigo"
          value={filtro.codigo}
          onChange={handleFiltroChange}
        />
        <TextField
          label="Nombre del Producto"
          name="nombreProducto" // Nombre del campo
          value={filtro.nombreProducto} // Valor del filtro
          onChange={handleFiltroChange}
        />
        <TextField
          label="Unidad de medida"
          name="unidadMedida"
          value={filtro.unidadMedida}
          onChange={handleFiltroChange}
        />
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
            Inventario
          </Typography>
        </Box>
  
        <Paper sx={{ width: "100%", margin: "0 auto" }}>
          <TableContainer sx={{ maxHeight: "600px", backgroundColor: "#eaeded" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "Codigo",
                      "Producto",
                      "Cantidad",
                      "Unidad de medida",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        align="left" // Cambia a "left" para alinear todo a la izquierda
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#f4f6f7",
                          color: "black",
                          minWidth: 250,
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
  
                <TableBody>
                  {sortedInventario.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell align="left">{producto.codigo}</TableCell>
                      <TableCell align="left">{producto.nombreProducto}</TableCell>
                      <TableCell align="left">{Math.round(producto.cantidad)}</TableCell>
                      <TableCell align="left">{producto.unidadMedida}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}