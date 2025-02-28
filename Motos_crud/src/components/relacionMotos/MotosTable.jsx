import React, { useState } from "react";
import AddchartIcon from '@mui/icons-material/Addchart';
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
import { Box, Button, FormControlLabel, IconButton, Switch, Typography, } from "@mui/material";
import { ActualizarStatus, obtenerMotos } from "../../api/motosApi";
import { useEffect } from "react";
import { NavBar } from "../NavBar";
import { obtenerMarcas } from "../../api/marcasApi";
import { MarcasModal } from "./MarcasModal";
import { EditarModal } from "./EditarModal";
import { AgregarModal } from "./AgregarModal";

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

      <Button
        variant="contained"
        sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", }}
        onClick={handleOpenModalAdd}>
        <AddchartIcon sx={{ fontSize: 24 }} />
        Agregar Motos
      </Button>

      {/* <IconButton
          sx={{ color: "black" }}
          onClick={() => handleOpenModalMarcas()}
        >
          <AddCircleOutlineIcon />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Agregar Marca
          </Typography>
        </IconButton>


        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              color="default"
            />
          }
          label="Mostrar inactivas"
        /> */}


      <Box width="90%" maxWidth={2000} margin="0 auto" mt={4}>
        {/* Header alineado a la izquierda con fondo */}
        <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
          <Typography variant="h5" fontWeight="bold" color="white">
            Lista de Motos
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1, marginTop: 1 }}>
          <IconButton
            sx={{ color: "black" }}
            onClick={() => handleOpenModalMarcas()}
          >
            <AddCircleOutlineIcon />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Agregar Marca
            </Typography>
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1, marginTop: 1 }}>
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
        </Box>

        {/* Contenedor de la tabla */}
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    Inciso
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    Modelo
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    N.Serie
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    Placa
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    Propietario
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
                    }}
                  >
                    Nota
                  </TableCell>
                  <TableCell

                    sx={{

                      backgroundColor: "#d5dbdb",
                      color: "black",
                      textAlign: "right"
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
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.inciso}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.modelo}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.no_serie}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.placa}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.propietario}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {moto.nota}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton
                        variant="contained"
                        sx={{ color: 'black' }}
                        onClick={() => handleOpenModalEdit(moto)}
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="error"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleActualizarStatus(moto.id)}
                      >
                        <InventoryIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
        </Paper>
      </Box>
    </>
  );
};
