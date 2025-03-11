import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddchartIcon from '@mui/icons-material/Addchart';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { EliminarServicio, ObtenerServicios } from "../../api/ServiciosApi";
import { EditarServiciosModal } from "./EditarServiciosModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { AgregarServicios } from "./AgregarServicios";

export const CatalogoServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);

    const handleOpenModalEdit = (servicio) => {
        setServicioSeleccionado(servicio);
        setOpenModalEditar(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEditar(false);
        setServicioSeleccionado(null);
    };
    const handleOpenModalAgregar = () => {
        setOpenModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };


    const handleEliminarServicio = (id) => {
        EliminarServicio(id, (idEliminado) => {
            setServicios((serviciosActuales) => serviciosActuales.filter((servicio) => servicio.id !== idEliminado));
        });
    };

    const agregarServicioLista = (nuevoServicio) => {
        setServicios((prevServicios) => [...prevServicios, nuevoServicio]);
    };

    const actualizarLista = (servicioActualizado) => {
        setServicios((prevServicios) =>
            prevServicios.map((s) => (s.id === servicioActualizado.id ? servicioActualizado : s))
        );
    };

    const cargarServicios = async () => {
        const data = await ObtenerServicios();
        if (data) {
            setServicios(data);
            console.log(data);
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    const miniDrawerWidth = 50;

    return (
        <>
            <Box
                sx={{ backgroundColor: "#f2f3f4", minHeight: "100vh", paddingBottom: 4, transition: "margin 0.3s ease-in-out", marginLeft: `${miniDrawerWidth}px`, }}
            >
                <NavBar />

                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", }} onClick={handleOpenModalAgregar}
                >
                    <AddchartIcon sx={{ fontSize: 24 }} />
                    Agregar Servicio
                </Button>


                <Box width="90%" maxWidth={2000} margin="0 auto" mt={9}>
                    {/* Header alineado a la izquierda con fondo */}
                    <Box sx={{ backgroundColor: "#1f618d", padding: "10px 20px", borderRadius: "8px 8px 0 0" }}>
                        <Typography variant="h5" color="white">
                            Lista Servicios
                        </Typography>
                    </Box>
                </Box>

                <Paper sx={{ width: "90%", maxWidth: "2000px", margin: "0 auto", backgroundColor: "white", padding: 2 }}>
                    <TableContainer sx={{ maxHeight: 800, backgroundColor: "#ffff", border: "1px solid #d7dbdd", borderRadius: "2px" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "black", textAlign: "center", width: "16.66%", backgroundColor: "#f4f6f7" }}>Id</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "black", textAlign: "center", width: "16.66%", backgroundColor: "#f4f6f7" }}>Nombre</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "black", textAlign: "center", width: "16.66%", backgroundColor: "#f4f6f7" }}>Descripción</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "black", textAlign: "center", width: "16.66%", backgroundColor: "#f4f6f7" }}>Opciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {servicios.map((servicio) => (
                                    <TableRow key={servicio.id}>
                                        <TableCell align="right" sx={{ textAlign: "right", width: "16.66%" }}>{servicio.id}</TableCell>
                                        <TableCell align="right" sx={{ textAlign: "right", width: "16.66%" }}>{servicio.nombre}</TableCell>
                                        <TableCell align="right" sx={{ textAlign: "right", width: "16.66%" }}>{servicio.descripcion}</TableCell>
                                        <TableCell align="right" sx={{ textAlign: "right", width: "16.66%" }}>
                                            <IconButton sx={{ color: 'black' }} onClick={() => handleOpenModalEdit(servicio)}>
                                                <EditIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                            <IconButton sx={{ marginLeft: "10px", color: 'black' }} onClick={() => handleEliminarServicio(servicio.id)}>
                                                <DeleteIcon sx={{ fontSize: 20, color: 'red' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            <EditarServiciosModal onClose={handleCloseModalEdit} modalOpen={openModalEditar} servicio={servicioSeleccionado} actualizarLista={actualizarLista} />

            <AgregarServicios onClose={handleCloseModalAgregar} modalOpen={openModalAgregar} />
        </>
    );
};
