import React, { useEffect, useState } from "react";
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
import { Box, IconButton, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { EliminarServicio, ObtenerServicios } from "../../api/ServiciosApi";
import { Navigate, useNavigate } from "react-router-dom";
import { EditarServiciosModal } from "./EditarServiciosModal";
import DeleteIcon from '@mui/icons-material/Delete';

export const CatalogoServicios = () => {
    const [servicios, setServicios] = useState([]);
    const handleNavigate = (path) => navigate(path);
    const navigate = useNavigate();
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    const handleOpenModalEdit = (servicio) => {
        setServicioSeleccionado(servicio);
        setOpenModalEditar(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEditar(false);
        setServicioSeleccionado(null);
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

    return (
        <>
            <NavBar />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 1870, margin: "0 auto" }}>
                <Paper sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "#f4f6f7" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#a93226", textAlign: "center" }}>
                        Catalogo de Servicios
                    </Typography>
                    <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7 " }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white" }}>Id</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white" }}>Nombre</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white" }}>Descripción</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white" }}>Opciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {servicios.map((servicio) => (
                                    <TableRow key={servicio.id}>
                                        <TableCell align="center">{servicio.id}</TableCell>
                                        <TableCell align="center">{servicio.nombre}</TableCell>
                                        <TableCell align="center">{servicio.descripcion}</TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{ backgroundColor: "#f39c12", ":hover": { backgroundColor: "#f8c471", opacity: 0.7 } }} onClick={() => handleOpenModalEdit(servicio)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" sx={{ marginLeft: "10px" }} onClick={() => handleEliminarServicio(servicio.id)}>
                                                <DeleteIcon sx={{ fontSize: 35 }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <IconButton sx={{ backgroundColor: "#e74c3c", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, bottom: 50 }} onClick={() => handleNavigate("/servicios/AgregarServicios")}>
                    <AddIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>

            <EditarServiciosModal
                onClose={handleCloseModalEdit}
                modalOpen={openModalEditar}
                servicio={servicioSeleccionado}
                actualizarLista={actualizarLista}
            />
        </>
    );
};
