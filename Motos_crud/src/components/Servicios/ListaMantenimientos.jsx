import React, { useEffect, useState } from "react";
import AddchartIcon from '@mui/icons-material/Addchart';
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
import { EliminarMantenimiento, ObtenerMantenimientos } from "../../api/ServiciosApi";
import DeleteIcon from '@mui/icons-material/Delete';
import { RealizarMantenimiento } from "./RealizarMantenimiento";

export const ListaMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);

    const handleOpenModalAgregar = () => {
        setOpenModalAgregar(true);
    };
    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };

    const handleEliminarMantenimiento = (id) => {
        EliminarMantenimiento(id, (idEliminado) => {
            setMantenimientos((MantenimientosActuales) => MantenimientosActuales.filter((mantenimiento) => mantenimiento.id !== idEliminado));
        });
    };

    const actualizarLista = (mantenimientoActualizado) => {
        setMantenimientos((prevMantenimientos) =>
            prevMantenimientos.map((m) => (m.id === mantenimientoActualizado.id ? mantenimientoActualizado : m))
        );
    };

    const cargarMantenimientos = async () => {
        const data = await ObtenerMantenimientos();
        if (data) {
            setMantenimientos(data);
            console.log(data);
        }
    };

    useEffect(() => {
        cargarMantenimientos();
    }, []);


    return (
        <>
            <NavBar />

            <Button
                variant="contained"
                sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", }}
                onClick={handleOpenModalAgregar}>
                <AddchartIcon sx={{ fontSize: 24 }} />
                Agregar Mantenimiento
            </Button>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: 4 }}>
            </Box>

            <Box width="100%" maxWidth={1700} margin="0 auto">
                <Box sx={{ backgroundColor: "#1f618d", padding: 1.5, borderRadius: "5px 5px 0 0" }}>
                    <Typography variant="h6" color="white">
                        LISTA DE MANTENIMIENTOS
                    </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7 " }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Vehiculo
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Servicios(s)
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Refacciones de almacen
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Fecha Inicio
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Comentario
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Costo Partes/Refacciones
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Costo Total
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", color: "black", padding: "8px", }}>
                                    Opciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mantenimientos.length > 0 ? (
                                mantenimientos.map((mantenimiento) => (
                                    <TableRow key={mantenimiento.id}>
                                        <TableCell align="center">{mantenimiento.vehiculo}</TableCell>
                                        <TableCell align="center">{mantenimiento.servicio}</TableCell>
                                        <TableCell align="center">{mantenimiento.refacciones_almacen}</TableCell>
                                        <TableCell align="center">{mantenimiento.fecha_inicio}</TableCell>
                                        <TableCell align="center">{mantenimiento.comentario}</TableCell>
                                        <TableCell align="center">{mantenimiento.costo_refacciones}</TableCell>
                                        <TableCell align="center">{mantenimiento.costo_total}</TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{ color: 'black' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                variant="contained"
                                                color="error"
                                                style={{ marginLeft: "10px" }}
                                                onClick={() => handleEliminarMantenimiento(mantenimiento.id)}
                                            >
                                                <DeleteIcon sx={{ fontSize: 35 }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No hay mantenimientos disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
                <RealizarMantenimiento modalOpen={openModalAgregar} onClose={handleCloseModalAgregar} />

            </Box>
        </>
    );
};

