import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddchartIcon from "@mui/icons-material/Addchart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Grid2, IconButton, Paper, Typography, } from "@mui/material";
import { NavBar } from "../NavBar";
import { ObtenerGrupos } from "../../api/gruposApi";
import { useSpring, animated } from "@react-spring/web";
import { EditarGruposModal } from "./EditarGruposModal";
import { AgregarGruposModal } from "./AgregarGruposModal";

export const ListaGrupos = () => {
    const [grupos, setgrupos] = useState([]);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [gruposeleccionado, setgruposeleccionado] = useState(null);
    const [openModalAgregar, setOpenModalAgregar] = useState(false);

    const handleOpenModalEdit = (grupos) => {
        setgruposeleccionado(grupos);
        setOpenModalEditar(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEditar(false);
        setgruposeleccionado(null);
    };
    const handleOpenModalAgregar = () => {
        setOpenModalAgregar(true);
    };

    const handleCloseModalAgregar = () => {
        setOpenModalAgregar(false);
    };

    const agregargruposLista = (nuevogrupos) => {
        const nombreExistente = grupos.some(
            (grupos) =>
                grupos.nombre.toLowerCase() === nuevogrupos.nombre.toLowerCase()
        );

        if (nombreExistente) {
            setError(
                "El nombre del grupos ya existe. Por favor, elija otro nombre."
            );
        } else {
            setgrupos((prevgrupos) =>
                [...prevgrupos, nuevogrupos].sort((a, b) =>
                    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
                )
            );
            setError(null);
        }
    };

    const actualizarLista = (gruposActualizado) => {
        setgrupos((prevgrupos) =>
            prevgrupos
                .map((grupos) =>
                    grupos.id === gruposActualizado.id
                        ? gruposActualizado
                        : grupos
                )
                .sort((a, b) =>
                    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
                )
        );
    };

    const cargargrupos = async () => {
        const data = await ObtenerGrupos();
        if (data) {
            // Ordenar antes de actualizar el estado
            const sortedData = data.sort((a, b) =>
                a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
            );
            setgrupos(sortedData);
        }
    };

    useEffect(() => {
        cargargrupos();
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
                sx={{
                    backgroundColor: "#f2f3f4",
                    minHeight: "100vh",
                    paddingBottom: 4,
                    transition: "margin 0.3s ease-in-out",
                    marginLeft: `${miniDrawerWidth}px`,
                }}
            >
                <NavBar />
                <animated.div style={styles}>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end", // Mueve el contenido a la derecha
                            alignItems: "center",
                            marginTop: 3,
                            marginLeft: "60%", // Ajusta según tu diseño, o usa margin="0 auto" en el contenedor general
                        }}
                    >

                        <Box sx={{ flexGrow: 1 }}>
                            <Grid2
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
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
                                            Agregar grupos
                                        </Button>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </Box>

                    <Box width="60%" maxWidth={1500} margin="0 auto" mt={2}>
                        <Box
                            sx={{
                                backgroundColor: "#1f618d",
                                padding: "10px 20px",
                                borderRadius: "8px 8px 0 0",
                            }}
                        >
                            <Typography variant="h5" color="white">
                                Lista de grupos
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                backgroundColor: "white",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginLeft: 2,
                                }}
                            >

                            </Box>
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
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="left"
                                            sx={{
                                                fontWeight: "bold",
                                                width: "40%",
                                                backgroundColor: "#f4f6f7",
                                            }}
                                        >
                                            Nombre
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontWeight: "bold",
                                                width: "20%",
                                                backgroundColor: "#f4f6f7",
                                            }}
                                        >
                                            Opciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {grupos.map((grupos) => (
                                        <TableRow
                                            key={grupos.id}

                                        >
                                            <TableCell
                                                align="left"
                                                sx={{ textAlign: "left", width: "25%" }}
                                            >
                                                {grupos.nombre?.toUpperCase()}
                                            </TableCell>

                                            <TableCell align="center" sx={{ width: "20%" }}>
                                                <IconButton
                                                    sx={{ color: "black" }}
                                                    onClick={() => handleOpenModalEdit(grupos)}
                                                >
                                                    <EditIcon sx={{ fontSize: 20 }} />
                                                </IconButton>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </animated.div>
            </Box>

            <EditarGruposModal
                onClose={handleCloseModalEdit}
                modalOpen={openModalEditar}
                grupos={gruposeleccionado}
                actualizarLista={actualizarLista}
                Listagrupos={grupos}
            />

            <AgregarGruposModal
                onClose={handleCloseModalAgregar}
                modalOpen={openModalAgregar}
                agregargruposLista={agregargruposLista}
            />
        </>
    );
};
