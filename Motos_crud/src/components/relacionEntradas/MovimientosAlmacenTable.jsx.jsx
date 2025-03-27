import React, { useState, useEffect } from "react";
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
import { useSpring, animated } from "@react-spring/web";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import FeedIcon from "@mui/icons-material/Feed";
import { EditarProductoAlmacenModal } from "./EditarProductoAlmacenModal";
import { useNavigate } from "react-router";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

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

  // * filtros por paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Límite por página (puedes cambiarlo dinámicamente si es necesario)
  const [totalPages, setTotalPages] = useState(1); // Total de páginas (calculado desde el backend)

  // * filtro por idMovimiento, Fecha y quien realizo el movimiento
  const [filtro, setFiltro] = useState({
    idMovimiento: "",
    nombreUsuario: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleOpenModal = (id) => {
    setSelectedMovimiento(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMovimiento(null);
  };

  // * manejo del cambio de pagina
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchInventario(filtro.fechaInicio, filtro.fechaFin, newPage); // Asegúrate de pasar los valores correctos
    }
  };

  // * cargar los movimientos de la semana
  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    ); // Lunes
    const lastDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 7)
    ); // Domingo

    const fechaInicio = firstDayOfWeek.toISOString().split("T")[0];
    const fechaFin = lastDayOfWeek.toISOString().split("T")[0];

    setFiltro({ ...filtro, fechaInicio, fechaFin });
    fetchInventario(fechaInicio, fechaFin); // Llama a la función para cargar los movimientos inicialmente
  }, []); // Esto solo se ejecutará una vez al cargar el componente.

  // * peticion al backend
  const fetchInventario = async (
    fechaInicio,
    fechaFin,
    page = 1,
    limit = 10,
    idMovimiento = ""
  ) => {
    console.log("idMovimiento", idMovimiento); 
    console.log(
      "Página:",
      page,
      "Límite:",
      limit,
      "Fecha Inicio:",
      fechaInicio,
      "Fecha Fin:",
      fechaFin
    );

    try {
      // Si existe idMovimiento, ignoramos el rango de fechas
      if (!idMovimiento && (!fechaInicio || !fechaFin)) {
        console.error(
          "Las fechas proporcionadas no son válidas:",
          fechaInicio,
          fechaFin
        );
        return;
      }

      // Llamada a la función que carga los movimientos, pasando idMovimiento como un argumento
      const data = await cargarListasMovimientos(
        fechaInicio,
        fechaFin,
        page,
        idMovimiento
      ); // Aquí pasas idMovimiento

      console.log("Datos cargados:", data);

      if (data && data.data) {
        setInventario(data.data); // Actualiza el inventario con los datos de la página actual
        const totalRecords = data.meta.total || 0; // Asegúrate de que 'total' esté disponible
        setTotalPages(Math.ceil(totalRecords / limit)); // Calcula el total de páginas
      }
    } catch (error) {
      console.error("Error en la petición al obtener Inventario", error);
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

  const handleFiltroSearch = () => {
    // Si hay un idMovimiento, lo usamos en lugar de las fechas
    if (filtro.idMovimiento) {
      fetchInventario(null, null, 1, 10, filtro.idMovimiento); // No pasamos fechas si hay idMovimiento
    } else {
      fetchInventario(filtro.fechaInicio, filtro.fechaFin, 1); // Usamos fechas si no hay idMovimiento
    }
  };

  const movimientosFiltrados = inventario.filter((m) => {
    const nombreUsuarioMatch =
      !filtro.nombreUsuario ||
      m.nombreUsuario
        ?.toLowerCase()
        .includes(filtro.nombreUsuario.toLowerCase().trim());

    const idMovimientoMatch =
      !filtro.idMovimiento ||
      m.idMovimiento?.toString() === filtro.idMovimiento.toString(); // Asegúrate de que se haga una comparación exacta

    const fechaInicioMatch =
      !filtro.fechaInicio || m.fecha_movimiento >= filtro.fechaInicio;

    const fechaFinMatch =
      !filtro.fechaFin || m.fecha_movimiento <= filtro.fechaFin;

    return (
      nombreUsuarioMatch &&
      idMovimientoMatch &&
      fechaInicioMatch &&
      fechaFinMatch
    );
  });

  const limpiarFiltros = () => {
    window.location.reload();
  };

  // * estilo de navegacion al componente
    const styles = useSpring({
      from: { opacity: 0, transform: "translateY(50px)", filter: "blur(10px)" },
      to: { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
      config: { tension: 500, friction: 30 },
    });

  return (
    <>
      <NavBar onSearch={setSearchTerm} />
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
          label="No.Movimiento"
          name="idMovimiento"
          value={filtro.idMovimiento}
          onChange={handleFiltroChange}
        />
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleFiltroSearch}
        >
          Buscar
        </Button>
      </Box>

      <Box width="90%" maxWidth={1300} margin="0 auto" mt={2}>
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
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="left" // Alineado a la izquierda
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
                      {producto.fecha_movimiento
                        ? new Date(
                            producto.fecha_movimiento
                          ).toLocaleDateString("es-MX")
                        : "Fecha no disponible"}
                    </TableCell>
                    <TableCell align="left">
                      {producto.nombreUsuario}
                    </TableCell>
                    <TableCell align="left">
                      {producto.nombreAutorizo}
                    </TableCell>
                    <TableCell align="left">
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

        {/* Controles de paginación */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            sx={{ marginRight: 2 }}
          >
            Anterior
          </Button>
          <Typography
            variant="body1"
            sx={{ marginTop: "auto", marginBottom: "auto" }}
          >
            Página {currentPage} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            sx={{ marginLeft: 2 }}
          >
            Siguiente
          </Button>
        </Box>
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
    </animated.div>
    </>
  );
};
