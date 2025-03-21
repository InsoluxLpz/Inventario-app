import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';
import { obtenerProveedores } from '../../api/proveedoresApi';


export const AgregarProductoModal = ({ modalOpen, onClose, grupos, unidadMedida, agregarProducto }) => {
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
    const marcaRef = useRef(null);
    const unidadRef = useRef(null);
    const proveedoresRef = useRef(null);

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

        if (name === "precio") {
            let numericValue = value.replace(/[^0-9.]/g, "");

            const formattedValue = new Intl.NumberFormat('es-MX').format(numericValue);

            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

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

        const codigoSinEspacios = formData.codigo.trim();
        const nombreSinEspacios = formData.nombre.trim();
        const formDataConEspaciosEliminados = {
            ...formData,
            codigo: codigoSinEspacios,
            nombre: nombreSinEspacios,
        };

        const precioNumerico = parseFloat(formData.precio.replace(/[^\d.-]/g, ''));

        if (!validateForm()) return;
        const idUsuario = parseInt(localStorage.getItem('idUsuario'), 10);

        if (isNaN(idUsuario)) {
            setErrors((prev) => ({ ...prev, general: "Error: Usuario no identificado" }));
            return;
        }

        const formDataConUsuario = {
            ...formDataConEspaciosEliminados,
            precio: precioNumerico,
            idUsuario
        };

        try {
            const nuevoProducto = await agregarProductos(formDataConUsuario);

            if (nuevoProducto && nuevoProducto.producto && nuevoProducto.producto.length > 0) {
                const producto = nuevoProducto.producto[0]; // Accede al primer producto del arreglo

                const grupoSeleccionado = opcionesGrupos.find(gr => gr.value === producto.idGrupo);
                const unidadSeleccionada = opcionesUnidad.find(uni => uni.value === producto.idUnidadMedida);

                // Crear el objeto de producto con los nombres de grupo y unidad de medida
                const productoCompleto = {
                    ...producto,
                    grupo: grupoSeleccionado ? grupoSeleccionado.label : "No disponible",
                    unidad_medida: unidadSeleccionada ? unidadSeleccionada.label : "No disponible",
                };

                if (productoCompleto.nombre && productoCompleto.precio && productoCompleto.grupo && productoCompleto.unidad_medida) {
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
                    agregarProducto(productoCompleto);
                    onClose();
                } else {
                    console.error("Producto incompleto:", productoCompleto);
                }
            }

        } catch (error) {
            console.error("Error al agregar producto:", error);
            setErrors((prev) => ({ ...prev, general: "Ocurrió un error al agregar el producto. Inténtelo de nuevo." }));
        }
    };

    const handleKeyDown = (e, nextField, isSelect = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isSelect && nextField.current) {
                nextField.current.focus();
            } else {
                document.getElementById(nextField)?.focus();
            }
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
                                            id="codigo"
                                            type="text"
                                            name="codigo"
                                            className={`form-control ${errors.codigo ? "is-invalid" : ""}`}
                                            value={formData.codigo}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, "nombre")}
                                        />
                                        {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            id="nombre"
                                            type="text"
                                            name="nombre"
                                            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, marcaRef, true)}
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Grupo</label>
                                        <Select
                                            ref={marcaRef}
                                            id="grupo"
                                            options={opcionesGrupos}
                                            placeholder="SELECCIONA"
                                            value={opcionesGrupos.find(gr => gr.value === formData.grupo)}
                                            onChange={(selectedOption) => setFormData({ ...formData, grupo: selectedOption.value })}
                                            onKeyDown={(e) => handleKeyDown(e, "precio")}
                                        />
                                        {errors.grupo && <div className="text-danger small">{errors.grupo}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Precio</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ height: 47 }}>
                                                $
                                            </span>
                                            <input
                                                id="precio"
                                                type="text"
                                                name="precio"
                                                className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                                                value={formData.precio}
                                                onChange={handleChange}
                                                onKeyDown={(e) => handleKeyDown(e, unidadRef, true)}
                                            />

                                            {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Unidad de Medida</label>
                                        <Select
                                            ref={unidadRef}
                                            id='unidad_medida'
                                            options={opcionesUnidad}
                                            placeholder="SELECCIONA"
                                            value={opcionesUnidad.find(um => um.value === formData.unidad_medida)}
                                            onChange={(selectedOption) => setFormData({ ...formData, unidad_medida: selectedOption.value })}
                                            onKeyDown={(e) => handleKeyDown(e, proveedoresRef, true)}
                                        />
                                        {errors.unidad_medida && <div className="text-danger small">{errors.unidad_medida}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Proveedores</label>
                                        <Select
                                            ref={proveedoresRef}
                                            id='unidad_medida'
                                            options={proveedores}
                                            isMulti
                                            placeholder="SELECCIONA"
                                            value={proveedores.filter(p => formData.proveedores.includes(p.value))}
                                            onChange={handleSelectChange}
                                            onKeyDown={(e) => handleKeyDown(e, "descripcion")}
                                        />
                                        {errors.proveedores && <div className="text-danger small">{errors.proveedores}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            id='descripcion'
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