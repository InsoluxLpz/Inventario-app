import { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { ActualizarGrupo } from "../../api/gruposApi";

export const EditarGruposModal = ({ onClose, modalOpen, grupos, actualizarLista, Listagrupos }) => {
    if (!modalOpen) return null;

    const Grupos = Listagrupos;

    const [formData, setFormData] = useState({
        nombre: grupos.nombre,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (grupos) {
            setFormData({
                nombre: grupos.nombre || "",
            });
        }
    }, [grupos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key]?.toString().trim()) {
                newErrors[key] = "Este campo es obligatorio";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiar espacios al principio y al final del nombre SOLO antes de enviar
        const cleanedFormData = {
            ...formData,
            nombre: formData.nombre.trim(),
        };

        setFormData(cleanedFormData);

        // Validar si el nombre ya existe en los gruposs
        const nombregruposExistente = Grupos.find(
            (serv) => serv.nombre.toLowerCase() === cleanedFormData.nombre.toLowerCase() && serv.id !== grupos.id
        );

        if (nombregruposExistente) {
            setErrors((prev) => ({
                ...prev,
                nombre: "Ya existe un grupos con ese nombre",
            }));
            return;
        }

        if (!validateForm()) return;

        // Hacer la solicitud PUT al backend para actualizar el grupos
        const response = await ActualizarGrupo(grupos.id, cleanedFormData);

        if (response) {
            actualizarLista(response);
            onClose();
        }
    };

    const handleKeyDown = (e, nextField) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById(nextField)?.focus();
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                    <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                        <div className="modal-header" style={{ backgroundColor: '#f1c40f' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Editar grupos</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input id="nombre" type="text" name="nombre" className={`form-control ${errors.nombre ? "is-invalid" : ""}`} value={formData.nombre} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, "descripcion")} />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>
                                </div>
                            </div>
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
    );
};