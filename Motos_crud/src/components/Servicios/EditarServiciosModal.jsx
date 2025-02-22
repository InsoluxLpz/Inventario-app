import { useEffect, useState } from "react";
import { ActualizarServicio } from "../../api/ServiciosApi";
import { Button } from '@mui/material';

export const EditarServiciosModal = ({ onClose, modalOpen, servicio, actualizarLista }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,

    });

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (servicio) {
            setFormData({
                nombre: servicio.nombre || "",
                descripcion: servicio.descripcion || "",

            });
        }
    }, [servicio]);


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

        if (!validateForm()) return;

        const nuevoProducto = await ActualizarServicio(servicio.id, formData);

        if (nuevoProducto) {
            actualizarLista(nuevoProducto);
            onClose();
        }

    };

    return (
        <div className="modal-backdrop">
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                    <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                        <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Editar Servicio</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className={`form-control ${errors.nombre ? "is-invalid" : ""}`} value={formData.nombre} onChange={handleChange} />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Descripcion</label>
                                        <textarea type="text" name="descripcion" className={`form-control ${errors.descripcion ? "is-invalid" : ""}`} value={formData.descripcion} onChange={handleChange} />
                                        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
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