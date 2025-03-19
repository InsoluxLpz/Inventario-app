import React, { useState, useEffect } from "react";
import WarehouseIcon from "@mui/icons-material/Warehouse";
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
import { cargarListasCampos } from "../../api/almacenProductosApi";
import AddchartIcon from "@mui/icons-material/Addchart";
import InventoryIcon from "@mui/icons-material/Inventory";
import { EditarProductoAlmacenModal } from "./EditarProductoAlmacenModal";
import { obtenerProductos } from "../../api/productosApi";
import { obtenerProveedores } from "../../api/proveedoresApi";
import { useNavigate } from "react-router";

export const ProductoAlmacenTable = () => {
  const navigate = useNavigate();

  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  //  * filtro para el inventario
  const [filtro, setFiltro] = useState({
    codigo: "",
    fecha: "",
    unidadMedida: "",
  });

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

  //   * formato de dinero
  // const formatearDinero = (valor) => {
  //   return new Intl.NumberFormat("es-MX", {
  //     style: "currency",
  //     currency: "MXN",
  //   }).format(valor);
  // };

  // const filteredInventario = inventario.filter((producto) => {
  //   const matchesSearch =
  //     (producto.nombre?.toLowerCase() || "").includes(
  //       searchTerm.toLowerCase()
  //     ) ||
  //     (producto.codigo?.toLowerCase() || "").includes(
  //       searchTerm.toLowerCase()
  //     ) ||
  //     (producto.grupo?.toLowerCase() || "").includes(searchTerm.toLowerCase());

  //   return showInactive
  //     ? matchesSearch
  //     : matchesSearch && producto.status !== 0;
  // });

  const handleFiltroChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const filteredInventario = inventario.filter((m) => {
    // Comparación de código, asegurándote de que m.codigo no sea null o undefined
    const codigoMatch =
      filtro.codigo === "" ||
      (m.codigo &&
        m.codigo.toLowerCase().includes(filtro.codigo.toLowerCase().trim()));

    // Comparación de unidad de medida sin importar mauscula o minuscula
    const unidadMedidaMatch =
      filtro.unidadMedida === "" ||
      (m.unidadMedida &&
        m.unidadMedida
          .toLowerCase()
          .includes(filtro.unidadMedida.toLowerCase()));

    // Comparación de fecha
    const fechaMatch =
      filtro.fecha === "" ||
      (m.fecha_movimiento && m.fecha_movimiento.includes(filtro.fecha)); // Asegúrate que m.fecha_movimiento esté en formato adecuado

    return codigoMatch && unidadMedidaMatch && fechaMatch;
  });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "30px", // Espacio entre los botones
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
            position: "absolute",
            right: 20,
            borderRadius: "8px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginRight: 28,
          }}
          onClick={() => navigate("/almacen/MovimientosAlmacenTable")}
        >
          <WarehouseIcon sx={{ fontSize: 24 }} />
          Movimientos
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
          onClick={() => navigate("/almacen/entradas")}
        >
          <PlaylistAddCircleIcon sx={{ fontSize: 24 }} />
          Agregar entradas
        </Button>
      </div>

      <Box display="flex" justifyContent="center" gap={1} my={2} mt={10}>
        <TextField
          label="Codigo"
          name="codigo"
          value={filtro.codigo}
          onChange={handleFiltroChange}
        />
        <TextField
          label="Filtrar por"
          name="fecha"
          type="date"
          value={filtro.fecha}
          onChange={handleFiltroChange}
          onFocus={(e) => (e.target.showPicker ? e.target.showPicker() : null)} // Agregar verificación para `showPicker`
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Unidad de medida"
          name="unidadMedida"
          value={filtro.unidadMedida}
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
            Inventario
          </Typography>
        </Box>

        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 600, backgroundColor: "#eaeded" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    // "id",
                    "Codigo",
                    "Producto",
                    "Cantidad",
                    "Unidad de medida",
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
                    {/* <TableCell align="center">{producto.idProducto}</TableCell> */}
                    <TableCell align="center">{producto.codigo}</TableCell>
                    <TableCell align="center">
                      {producto.nombreProducto}
                    </TableCell>
                    <TableCell align="center">
                      {Math.round(producto.cantidad)}
                    </TableCell>
                    <TableCell align="center">
                      {producto.unidadMedida}
                    </TableCell>
                    {/* <TableCell align="center">
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
                    </TableCell> */}
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
    </>
  );
};
