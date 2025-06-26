import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddchartIcon from "@mui/icons-material/Addchart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, Paper, Typography, Grid2 } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { NavBar } from "../NavBar";
import { ObtenerAlmacenes } from "../../api/multiAlmacenesApi"; // Asegúrate de tener esta función
import { EditarAlmacenesModal } from "./EditarAlmacenesModal";
import { AgregarAlmacenesModal } from "./AgregarAlmacenesModal";

export const ListaMultiAlmacenes = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);

    const handleOpenModalEdit = (almacen) => {
        setAlmacenSeleccionado(almacen);
        setOpenModalEditar(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEditar(false);
        setAlmacenSeleccionado(null);
    };

    const handleOpenModalAgregar = () => {
        setOpenModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };

    const agregarAlmacenLista = (nuevoAlmacen) => {
        const nombreExistente = almacenes.some(
            (alm) => alm.nombre.toLowerCase() === nuevoAlmacen.nombre.toLowerCase()
        );

        if (!nombreExistente) {
            setAlmacenes((prev) =>
                [...prev, nuevoAlmacen].sort((a, b) =>
                    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
                )
            );
        } else {
            alert("El nombre del almacén ya existe.");
        }
    };

    const actualizarLista = (almacenActualizado) => {
        setAlmacenes((prev) =>
            prev
                .map((alm) =>
                    alm.id === almacenActualizado.id ? almacenActualizado : alm
                )
                .sort((a, b) =>
                    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
                )
        );
    };

    const cargarAlmacenes = async () => {
        const data = await ObtenerAlmacenes();
        if (data) {
            const sortedData = data.sort((a, b) =>
                a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
            );
            setAlmacenes(sortedData);
        }
    };

    useEffect(() => {
        cargarAlmacenes();
    }, []);

    const styles = useSpring({
        from: { opacity: 0, transform: "translateY(50px)", filter: "blur(10px)" },
        to: { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
        config: { tension: 500, friction: 30 },
    });

    const miniDrawerWidth = 50;

    return (
        <Box
            sx={{
                backgroundColor: "#f2f3f4",
                minHeight: "100vh",
                paddingBottom: 4,
                marginLeft: `${miniDrawerWidth}px`,
            }}
        >
            <NavBar />
            <animated.div style={styles}>
                <Box width="60%" maxWidth={1500} margin="0 auto" mt={2}>
                    <Box
                        sx={{
                            backgroundColor: "#1f618d",
                            padding: "10px 20px",
                            borderRadius: "8px 8px 0 0",
                        }}
                    >
                        <Typography variant="h5" color="white">
                            Lista de almacenes
                        </Typography>
                    </Box>
                </Box>


                <Paper
                    sx={{
                        width: "60%",
                        maxWidth: "2000px",
                        margin: "0 auto",
                        backgroundColor: "white",
                        padding: 2,
                    }}
                >
                    <TableContainer
                        sx={{
                            maxHeight: 560,
                            backgroundColor: "#ffff",
                            border: "1px solid #d7dbdd",
                            borderRadius: "2px",
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7" }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f7" }} align="center">Opciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {almacenes.map((alm) => (
                                    <TableRow key={alm.id}>
                                        <TableCell>{alm.nombre.toUpperCase()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleOpenModalEdit(alm)}>
                                                <EditIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                            {/* <IconButton onClick={() => handleOpenModalEdit(alm)}>
                                                <DeleteIcon sx={{ fontSize: 20, color: "#922b21 " }} />
                                            </IconButton> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Box sx={{ display: "flex", marginTop: 3, marginLeft: "63%" }}>
                    <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                        <Grid2 item sm={6} md={3}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#1f618d",
                                        color: "white",
                                        ":hover": { opacity: 0.7 },
                                        borderRadius: "8px",
                                        padding: "5px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginRight: 1,
                                    }}
                                    onClick={handleOpenModalAgregar}
                                >
                                    <AddchartIcon sx={{ fontSize: 24 }} />
                                    Agregar almacén
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>

            </animated.div>

            <EditarAlmacenesModal
                onClose={handleCloseModalEdit}
                modalOpen={openModalEditar}
                almacen={almacenSeleccionado}
                actualizarLista={actualizarLista}
                listaAlmacenes={almacenes}
            />

            <AgregarAlmacenesModal
                onClose={handleCloseModalAgregar}
                modalOpen={openModalAgregar}
                agregarAlmacenLista={agregarAlmacenLista}
            />
        </Box>
    );
};
