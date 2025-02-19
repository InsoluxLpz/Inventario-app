import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
  Typography,
} from "@mui/material";
import { EditarModal } from "./EditarModal";
import { AgregarModal } from "./AgregarModal";
import { ActualizarStatus, obtenerMotos } from "../../api/motosApi";
import { useEffect } from "react";
import { NavBar } from "../NavBar";
import { obtenerMarcas } from "../../api/marcasApi";
import { MarcasModal } from "./MarcasModal";

export const MotosTable = () => {
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalMarcas, setOpenModalMarcas] = useState(false);
  const [motos, setMotos] = useState([]);
  const [motoSeleccionada, setMotoSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [marcas, setMarcas] = useState([]);

  const handleOpenModalEdit = (moto) => {
    setMotoSeleccionada(moto); // Al abrir el modal, guardas la moto seleccionada
    setOpenModalEditar(true);
  };

  const handleOpenModalMarcas = () => {
    setOpenModalMarcas(true);
  };

  const handleCloseModalMarcas = () => {
    setOpenModalMarcas(false);
  };
  const handleCloseModalEdit = () => {
    setOpenModalEditar(false);
    setMotoSeleccionada(null); // Limpiar la moto seleccionada al cerrar el modal
  };

  const handleOpenModalAdd = () => {
    setOpenModalAgregar(true);
  };

  const handleCloseModalAdd = () => {
    setOpenModalAgregar(false);
  };

  const handleActualizarStatus = (id) => {
    ActualizarStatus(id, (idActualizado) => {
      setMotos((motosActuales) =>
        motosActuales.map((moto) =>
          moto.id === idActualizado ? { ...moto, status: 0 } : moto
        )
      );
    });
  };

  const fetchMarcas = async () => {
    const data = await obtenerMarcas();
    if (data) {
      setMarcas(data);
      console.log(data);
    }
  };

  const agregarMotoLista = (nuevaMoto) => {
    setMotos((prevMotos) => [...prevMotos, nuevaMoto]);
  };

  const actualizarLista = (motoActualizada) => {
    setMotos((prevMotos) =>
      prevMotos.map((m) => (m.id === motoActualizada.id ? motoActualizada : m))
    );
  };

  const fetchMotos = async () => {
    const data = await obtenerMotos();
    if (data) {
      setMotos(data);
      console.log(data);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#5d6d7e"; // Amarillo claro para "inactiva"
      case 2:
        return "#f5b041"; // Amarillo claro para "Taller"
      case 3:
        return "#ef5350"; // Rojo claro para "Accidente o Tránsito"
      default:
        return "transparent"; // Fondo transparente si no coincide
    }
  };

  const filteredMotos = motos.filter((moto) => {
    const matchesSearch =
      moto.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moto.no_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moto.inciso.toLowerCase().includes(searchTerm.toLowerCase());

    // Mostrar todas las coincidencias si el filtro de inactivos está activo
    if (showInactive) {
      return matchesSearch;
    }

    // Si el filtro está desactivado, ocultar status 0 excepto si se busca algo
    return matchesSearch && moto.status !== 0;
  });

  useEffect(() => {
    fetchMotos();
    fetchMarcas();
  }, []);

  return (
    <>
      <NavBar onSearch={setSearchTerm} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Contenedor con Header */}
        <Paper
          sx={{
            width: "100%",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#f4f6f7",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#a93226", textAlign: "center" }}
          >
            Lista de Motos
          </Typography>

          {/* Controles: Botón + Switch */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Botón Agregar Marca */}
            <IconButton
              sx={{ color: "black" }}
              onClick={() => handleOpenModalMarcas()}
            >
              <AddCircleOutlineIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Agregar Marca
              </Typography>
            </IconButton>

            {/* Switch Mostrar Inactivas */}
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  color="default"
                />
              }
              label="Mostrar inactivas"
            />
          </Box>
          <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7 " }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Inciso
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Modelo
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    N.Serie
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Placa
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Propietario
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Nota
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#a93226",
                      color: "white",
                      padding: "8px",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMotos.map((moto) => (
                  <TableRow
                    key={moto.id}
                    sx={{ backgroundColor: getStatusColor(moto.status) }}
                  >
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.inciso}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.modelo}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.no_serie}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.placa}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.propietario}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {moto.nota}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      <IconButton
                        variant="contained"
                        sx={{
                          backgroundColor: "#f39c12 ",
                          ":hover": {
                            backgroundColor: "#f8c471 ",
                            opacity: 0.7,
                          },
                        }}
                        onClick={() => handleOpenModalEdit(moto)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleActualizarStatus(moto.id)}
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
          variant="contained"
          onClick={handleOpenModalAdd}
          sx={{
            backgroundColor: "#e74c3c",
            color: "white",
            ":hover": { backgroundColor: "#e74c3c", opacity: 0.7 },
            position: "fixed",
            right: 50,
            bottom: 50,
          }}
          style={{
            alignSelf: "flex-end",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <AddIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      <EditarModal
        onClose={handleCloseModalEdit}
        modalOpen={openModalEditar}
        moto={motoSeleccionada}
        actualizarLista={actualizarLista}
        listaMarcas={marcas}
      />
      <AgregarModal
        onClose={handleCloseModalAdd}
        modalOpen={openModalAgregar}
        agregarMotoLista={agregarMotoLista}
        listaMarcas={marcas}
      />
      <MarcasModal
        onClose={handleCloseModalMarcas}
        modalOpen={openModalMarcas}
      />
    </>
  );
};
