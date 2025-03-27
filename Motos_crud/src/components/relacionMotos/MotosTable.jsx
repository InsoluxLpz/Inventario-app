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
import { Box, Button, FormControlLabel, IconButton, Switch, TextField, Typography, } from "@mui/material";
import { ActualizarStatus, obtenerMotos } from "../../api/motosApi";
import { useEffect } from "react";
import { NavBar } from "../NavBar";
import { obtenerMarcas } from "../../api/marcasApi";
import { MarcasModal } from "./MarcasModal";
import { EditarModal } from "./EditarModal";
import { AgregarModal } from "./AgregarModal";
import { Grid } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";


export const MotosTable = () => {
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalMarcas, setOpenModalMarcas] = useState(false);
  const [motos, setMotos] = useState([]);
  const [motoSeleccionada, setMotoSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [searchInciso, setSearchInciso] = useState("");
  const [searchNoSerie, setSearchNoSerie] = useState("");
  const [searchPlaca, setSearchPlaca] = useState("");

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
    setMotos((prevMotos) =>
      [...prevMotos, nuevaMoto].sort((a, b) =>
        a.inciso.localeCompare(b.inciso, undefined, { numeric: true })
      )
    );
  };


  const actualizarLista = (motoActualizada) => {
    setMotos((prevMotos) =>
      prevMotos
        .map((m) => (m.id === motoActualizada.id ? motoActualizada : m))
        .sort((a, b) => a.inciso.localeCompare(b.inciso, undefined, { numeric: true }))
    );
  };


  const fetchMotos = async () => {
    const data = await obtenerMotos();
    if (data) {
      // Ordenar las motos por inciso antes de setear el estado
      const sortedData = data.sort((a, b) =>
        a.inciso.localeCompare(b.inciso, undefined, { numeric: true })
      );
      setMotos(sortedData);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#f5b7b1"; // Amarillo claro para "inactiva"
      case 2:
        return "#f5b041"; // Amarillo claro para "Taller"
      case 3:
        return "#ef5350"; // Rojo claro para "Accidente o Tránsito"
      default:
        return "transparent"; // Fondo transparente si no coincide
    }
  };

  const filteredMotos = motos
    .filter((moto) => {
      const matchesPlaca = searchPlaca.trim() === "" || moto.placa.toLowerCase().includes(searchPlaca.toLowerCase().trim());
      const matchesNoSerie = searchNoSerie.trim() === "" || moto.no_serie.toLowerCase().includes(searchNoSerie.toLowerCase().trim());
      const matchesInciso = searchInciso.trim() === "" || moto.inciso.toLowerCase().includes(searchInciso.toLowerCase().trim());

      return (showInactive ? true : moto.status !== 0) && matchesPlaca && matchesNoSerie && matchesInciso;
    })
    .sort((a, b) => a.inciso.localeCompare(b.inciso, undefined, { numeric: true }));


  useEffect(() => {
    fetchMotos();
    fetchMarcas();
  }, []);

  const miniDrawerWidth = 50;

    // * diseño de carga en las tablas
    const styles = useSpring({
      from: { opacity: 0, transform: "translateY(50px)", filter: "blur(10px)" },
      to: { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
      config: { tension: 500, friction: 30 },
    });
  
  return (
    <>
      <Box
        sx={{ backgroundColor: "#f2f3f4", minHeight: "100vh", paddingBottom: 4, transition: "margin 0.3s ease-in-out", marginLeft: `${miniDrawerWidth}px`, }}
      >
        <NavBar onSearch={setSearchTerm} />
        <animated.div style={styles}>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 3, marginLeft: 12 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">

              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label="Buscar por Inciso" variant="outlined" sx={{ backgroundColor: "white" }} value={searchInciso} onChange={(e) => setSearchInciso(e.target.value)} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label="Buscar por N.Serie" variant="outlined" sx={{ backgroundColor: "white" }} value={searchNoSerie} onChange={(e) => setSearchNoSerie(e.target.value)} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth label="Buscar por Placa" variant="outlined" sx={{ backgroundColor: "white" }} value={searchPlaca} onChange={(e) => setSearchPlaca(e.target.value)} />
              </Grid>

              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, right: 20, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", marginRight: 8 }}
                  onClick={handleOpenModalAdd}>
                  <AddchartIcon sx={{ fontSize: 24 }} />
                  Agregar Motos
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>


        <Box width="90%" maxWidth={2000} margin="0 auto" mt={4}>

          <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
            <Typography variant="h5" color="white">
              Lista de Motos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", backgroundColor: 'white' }}>
            <IconButton
              sx={{ color: "black" }}
              onClick={() => handleOpenModalMarcas()}
            >
              <AddCircleOutlineIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Agregar Marca
              </Typography>
            </IconButton>

            <Box sx={{ display: "flex", justifyContent: "flex-end", marginLeft: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                }
                label="Mostrar inactivas"
              />
            </Box>
          </Box>

          <Paper sx={{ width: "100%", maxWidth: "2000px", margin: "0 auto", backgroundColor: "white", padding: 2 }}>
            <TableContainer sx={{ maxHeight: 600, backgroundColor: "#ffff", border: "1px solid #d7dbdd", borderRadius: "2px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Inciso", "Modelo", "N.Serie", "Placa", "Propietario", "Nota", "Acciones"].map((col) => (
                      <TableCell key={col} sx={{ backgroundColor: "#f4f6f7", color: "black", textAlign: "left", fontWeight: "bold" }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMotos.map((moto) => (
                    <TableRow key={moto.id} sx={{
                      backgroundColor: getStatusColor(moto.status), "&:hover": {
                        backgroundColor: "#eaecee ",
                      }
                    }}>
                      <TableCell sx={{ textAlign: "left" }}>{moto.inciso}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{moto.modelo}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{moto.no_serie}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{moto.placa}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{moto.propietario}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>{moto.nota}</TableCell>
                      <TableCell sx={{ textAlign: "left" }}>
                        <IconButton onClick={() => handleOpenModalEdit(moto)}>
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton color="error" sx={{ marginLeft: 1 }} onClick={() => handleActualizarStatus(moto.id)}>
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
        </animated.div>
      </Box>
    </>
  );
};