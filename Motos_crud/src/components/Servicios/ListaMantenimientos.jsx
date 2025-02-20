import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, IconButton, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { useNavigate } from "react-router";
import { EliminarMantenimiento, ObtenerMantenimientos } from "../../api/ServiciosApi";
import DeleteIcon from '@mui/icons-material/Delete';


export const ListaMantenimientos = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const handleNavigate = (path) => navigate(path);
    const navigate = useNavigate();

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
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 1870, margin: "0 auto", }}>

                <Paper
                    sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "#f4f6f7", }} >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: "#a93226", textAlign: "center" }}
                    >
                        Lista de Mantenimientos
                    </Typography>

                    <Box
                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>

                    </Box>
                    <TableContainer sx={{ maxHeight: 800, backgroundColor: "#f4f6f7 " }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Vehiculo
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Servicios(s)
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Refacciones de almacen
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Fecha Inicio
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Comentario
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Costo Partes/Refacciones
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
                                        Costo Total
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", backgroundColor: "#a93226", color: "white", padding: "8px", }}>
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
                                                {/* <IconButton sx={{
                                                    backgroundColor: "#f39c12",
                                                    ":hover": { backgroundColor: "#f8c471", opacity: 0.7 },
                                                }}
                                                >
                                                    <EditIcon />
                                                </IconButton> */}
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
                </Paper>
                <IconButton
                    variant="contained"
                    sx={{ backgroundColor: "#e74c3c", color: "white", ":hover": { backgroundColor: "#e74c3c", opacity: 0.7 }, position: "fixed", right: 50, bottom: 50, }}
                    style={{ alignSelf: "flex-end", marginBottom: "10px", marginTop: "10px", }} onClick={() => handleNavigate("/servicios/RealizarMantenimiento")}>
                    <AddIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </>
    );
};

