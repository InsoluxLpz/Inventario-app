import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { AgregarServicio } from "../../api/ServiciosApi";
import { useNavigate } from "react-router";

export const AgregarServicios = ({ modalOpen, onClose }) => {
    if (!modalOpen) return null;

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
            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                        <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Agregar Servicio</h5>
                            </div>

                            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
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
                                <div className="modal-footer">
                                    <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }} onClick={handleSubmit}>
                                        Guardar
                                    </Button>

                                    <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }} onClick={onClose}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
