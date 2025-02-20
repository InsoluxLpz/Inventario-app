import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { NavBar } from "../NavBar";
import { AgregarServicio } from "../../api/ServiciosApi";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from '@mui/icons-material/Home';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

export const AgregarServicios = () => {

    const [servicio, setServicio] = useState({
        nombre: "",
        descripcion: ""
    });

    const [errors, setErrors] = useState({});
    const handleNavigate = (path) => navigate(path);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setServicio({
            ...servicio,
            [event.target.name]: event.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(servicio).forEach((key) => {

            if (Array.isArray(servicio[key])) {
                if (servicio[key].length === 0) {
                    newErrors[key] = "Este campo es obligatorio";
                }
            } else if (!servicio[key].trim()) {
                newErrors[key] = "Este campo es obligatorio";
            }

        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar que la página se recargue

        if (!validateForm()) return;
        const response = await AgregarServicio(servicio);

        if (response && !response.error) {
            console.log(response);
            setFormData({
                nombre: "",
                descripcion: "",
            });
            setErrors({});
            navigate("/servicios/CatalogoServicios");
        }
    };

    return (
        <>
            <NavBar />

            <Button
                variant="contained"
                sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
                onClick={() => navigate("/servicios/CatalogoServicios")}
            >
                <HomeRepairServiceIcon sx={{ fontSize: 24 }} />
                Servicios
            </Button>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: 4 }}>
                {/* <Button variant="contained" color="primary" onClick={() => navigate("/servicios")}>
                    📋 Catálogo Servicios
                </Button> */}
            </Box>

            <Box width="100%" maxWidth={1700} margin="0 auto">
                <Box sx={{ backgroundColor: "#1f618d", padding: 1.5, borderRadius: "5px 5px 0 0" }}>
                    <Typography variant="h6" color="white">
                        AGREGAR SERVICIO
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit} style={{ padding: "20px", background: "#f2f3f4" }}>
                    <Box sx={{ maxWidth: "2000px", margin: "0 auto" }}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className={`form-control ${errors.nombre ? "is-invalid" : ""} `}
                                    value={servicio.nombre}
                                    onChange={handleChange}
                                />
                                {errors.nombre && (
                                    <div className="invalid-feedback">{errors.nombre}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    type="text"
                                    name="descripcion"
                                    className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                                    value={servicio.descripcion}
                                    onChange={handleChange}
                                />
                                {errors.descripcion && (
                                    <div className="invalid-feedback">{errors.descripcion}</div>
                                )}
                            </div>
                        </div>

                    </Box>
                    <Box display="flex" gap={2}>
                        <Button type="submit" style={{ backgroundColor: "#0091ea", color: "white" }}>
                            Guardar
                        </Button>
                        <Button type="button" style={{ backgroundColor: "#85929e", color: "white", }} onClick={() => handleNavigate("/servicios/CatalogoServicios")}>
                            Cancelar
                        </Button>
                    </Box>
                </form>
                <IconButton sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { backgroundColor: '#aed6f1 ' }, position: "fixed", right: 50, bottom: 50 }}
                    onClick={() => navigate("/inicio")}
                >
                    <HomeIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box >
        </>
    );
};
