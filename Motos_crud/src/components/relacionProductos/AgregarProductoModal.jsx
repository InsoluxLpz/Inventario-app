import React, { useEffect, useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material';
import { NavBar } from '../NavBar';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';
import { obtenerProveedores } from '../../api/proveedoresApi';


export const AgregarProductoModal = ({ modalOpen, onClose }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        grupo: "",
        precio: "",
        descripcion: "",
        unidad_medida: "",
        proveedores: [],
    });

    const [errors, setErrors] = useState({});
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        const cargarProveedores = async () => {
            const data = await obtenerProveedores();
            console.log(data)
            if (data) {
                setProveedores(data.map((prov) => ({ value: prov.nombreProveedor, label: prov.nombreProveedor })));
            }
        };
        cargarProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData((prev) => ({
            ...prev,
            proveedores: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
        setErrors((prev) => ({ ...prev, proveedores: "" }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            if (key !== "descripcion") {
                if (Array.isArray(formData[key])) {
                    if (formData[key].length === 0) {
                        newErrors[key] = "Este campo es obligatorio";
                    }
                } else if (!formData[key].trim()) {
                    newErrors[key] = "Este campo es obligatorio";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        const nuevoProducto = await agregarProductos(formData);

        if (nuevoProducto && !nuevoProducto.error) {
            console.log(nuevoProducto);
            setFormData({
                codigo: "",
                nombre: "",
                grupo: "",
                precio: "",
                descripcion: "",
                unidad_medida: "",
                proveedores: [],
            });
            setErrors({});
        } else if (nuevoProducto?.error) {
            setErrors((prev) => ({ ...prev, codigo: nuevoProducto.error }));
        }
    };

    return (
        <>
            <NavBar />

            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                        <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Agregar Producto</h5>
                            </div>

                            <form onSubmit={handleSubmit} style={{ padding: "20px", maxHeight: "300vh" }}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Código</label>
                                            <input
                                                type="text"
                                                name="codigo"
                                                className={`form-control ${errors.codigo ? "is-invalid" : ""}`}
                                                value={formData.codigo}
                                                onChange={handleChange}
                                            />
                                            {errors.codigo && (
                                                <div className="invalid-feedback">{errors.codigo}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                                value={formData.nombre}
                                                onChange={handleChange}
                                            />
                                            {errors.nombre && (
                                                <div className="invalid-feedback">{errors.nombre}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Grupo</label>
                                            <select
                                                name="grupo"
                                                className={`form-control ${errors.grupo ? "is-invalid" : ""}`}
                                                value={formData.grupo}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>
                                                    SELECCIONA
                                                </option>
                                                <option>FRENOS</option>
                                                <option>LLANTAS</option>
                                                <option>ACEITE</option>
                                            </select>
                                            {errors.grupo && (
                                                <div className="invalid-feedback">{errors.grupo}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Precio</label>
                                            <div className="input-group">
                                                <span className="input-group-text" style={{ height: 47 }}>
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    name="precio"
                                                    className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                                                    value={formData.precio}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.precio && (
                                                <div className="invalid-feedback">{errors.precio}</div>
                                            )}
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                name="descripcion"
                                                className={`form-control ${errors.descripcion ? "is-valid" : ""
                                                    }`}
                                                value={formData.descripcion}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Unidad de Medida</label>
                                            <select
                                                name="unidad_medida"
                                                className={`form-control ${errors.unidad_medida ? "is-invalid" : ""
                                                    }`}
                                                value={formData.unidad_medida}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>
                                                    SELECCIONA
                                                </option>
                                                <option>PIEZAS</option>
                                                <option>CAJAS</option>
                                                <option>LITROS</option>
                                            </select>
                                            {errors.unidad_medida && (
                                                <div className="invalid-feedback">{errors.unidad_medida}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Proveedor</label>
                                            <Select
                                                name="proveedores"
                                                options={proveedores}
                                                isMulti
                                                classNamePrefix="select"
                                                value={formData.proveedores.map((p) => ({ value: p, label: p, }))}
                                                onChange={handleSelectChange}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        minHeight: "45px",
                                                        height: "45px",
                                                    }),
                                                }}
                                            />
                                            {errors.proveedores && (
                                                <div className="text-danger small">{errors.proveedores}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="modal-footer ">
                                    <Button type="submit" style={{ backgroundColor: "#0091ea", color: "white", padding: "10px 20px", }} onClick={handleSubmit}>
                                        Guardar
                                    </Button>

                                    <Button type="button" style={{ backgroundColor: "#85929e", color: "white", padding: "10px 20px", margin: 20 }}

                                        onClick={onClose}
                                    >
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
