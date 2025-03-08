import React, { useEffect, useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material';
import { NavBar } from '../NavBar';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';
import { obtenerProveedores } from '../../api/proveedoresApi';


export const AgregarProductoModal = ({ modalOpen, onClose, grupos, unidadMedida }) => {
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
            if (data) {
                const proveedoresFiltrados = data.filter(prov => prov.status !== 0);
                console.log("Proveedores filtrados:", proveedoresFiltrados);
                setProveedores(proveedoresFiltrados.map(prov => ({
                    value: prov.id,
                    label: prov.nombre_proveedor,
                })));
            }
        };
        cargarProveedores();
    }, []);


    const opcionesGrupos = grupos.map(grupo => ({ value: grupo.id, label: grupo.nombre }));
    const opcionesUnidad = unidadMedida.map(uni => ({ value: uni.id, label: uni.nombre }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            proveedores: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
        setErrors(prev => ({ ...prev, proveedores: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== "descripcion" && !formData[key]) {
                newErrors[key] = "Este campo es obligatorio";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const precioNumerico = parseFloat(formData.precio.replace(/[^\d.-]/g, ''));

        if (!validateForm()) return;
        const idUsuario = parseInt(localStorage.getItem('idUsuario'), 10);

        if (isNaN(idUsuario)) {
            setErrors((prev) => ({ ...prev, general: "Error: Usuario no identificado" }));
            return;
        }

        const formDataConUsuario = {
            ...formData,
            precio: precioNumerico,
            idUsuario
        };

        const nuevoProducto = await agregarProductos(formDataConUsuario);

        if (nuevoProducto && !nuevoProducto.error) {
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
            onClose();
        } else if (nuevoProducto?.error) {
            setErrors((prev) => ({ ...prev, codigo: nuevoProducto.error }));
        }
    };



    return (
        <div className="modal-backdrop">
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{ maxWidth: "50vw", marginTop: 90 }}>
                    <div className="modal-content w-100" style={{ maxWidth: "50vw" }}>
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
                                        {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
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
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Grupo</label>
                                        <Select
                                            options={opcionesGrupos}
                                            placeholder="SELECCIONA"
                                            value={opcionesGrupos.find(gr => gr.value === formData.grupo)}
                                            onChange={(selectedOption) => setFormData({ ...formData, grupo: selectedOption.value })}
                                        />
                                        {errors.grupo && <div className="text-danger small">{errors.grupo}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Precio</label>
                                        <input
                                            type="text"
                                            name="precio"
                                            className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                                            value={formData.precio}
                                            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        />
                                        {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Unidad de Medida</label>
                                        <Select
                                            options={opcionesUnidad}
                                            placeholder="SELECCIONA"
                                            value={opcionesUnidad.find(um => um.value === formData.unidad_medida)}
                                            onChange={(selectedOption) => setFormData({ ...formData, unidad_medida: selectedOption.value })}
                                        />
                                        {errors.unidad_medida && <div className="text-danger small">{errors.unidad_medida}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Proveedores</label>
                                        <Select
                                            options={proveedores}
                                            isMulti
                                            placeholder="SELECCIONA"
                                            value={proveedores.filter(p => formData.proveedores.includes(p.value))}
                                            onChange={handleSelectChange}
                                        />
                                        {errors.proveedores && <div className="text-danger small">{errors.proveedores}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            className="form-control"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }}>
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