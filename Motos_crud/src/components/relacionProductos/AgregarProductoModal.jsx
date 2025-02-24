import React, { useEffect, useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material';
import { NavBar } from '../NavBar';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';
import { obtenerProveedores } from '../../api/proveedoresApi';


export const AgregarProductoModal = ({ modalOpen, onClose, grupos, unidadMedida }) => {
    if (!modalOpen) return null;

    const Grupos = grupos;
    const unidad = unidadMedida

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
            const data = await obtenerProveedores(); // Asumo que `obtenerProveedores` te devuelve los proveedores

            if (data) {
                const proveedoresFiltrados = data.filter(prov => prov.status !== 0);
                setProveedores(proveedoresFiltrados.map((prov) => ({
                    value: prov.id, // Aquí se usa el ID
                    label: prov.nombreProveedor, // El nombre sigue siendo el label
                })));
            }
        };

        cargarProveedores();
    }, []);


    const opcionesGrupos = [...Grupos]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((grupo) => ({ value: grupo.id, label: grupo.nombre }));

    const opcionesUnidad = [...unidad]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((uni) => ({ value: uni.id, label: uni.nombre }));


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData((prev) => ({
            ...prev,
            proveedores: selectedOptions ? selectedOptions.map(option => option.value) : [], // Enviar el id
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
                } else if (typeof formData[key] === "string" && !formData[key].trim()) { // Solo llamar a .trim() si es un string
                    newErrors[key] = "Este campo es obligatorio";
                } else if (formData[key] == null || formData[key] === "") {
                    newErrors[key] = "Este campo es obligatorio";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Elimina el símbolo de dólar y convierte a número
        const precioNumerico = parseFloat(formData.precio.replace(/[^\d.-]/g, ''));

        if (!validateForm()) return;

        // Asegúrate de que el precio esté en formato numérico
        const formDataConPrecio = { ...formData, precio: precioNumerico };

        const nuevoProducto = await agregarProductos(formDataConPrecio);

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


    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/[^0-9.]/g, ""); // Permite solo números y punto decimal
        setFormData((prev) => ({ ...prev, precio: value }));
    };

    const formatearDinero = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
        }).format(value);
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
                                            name="grupo"
                                            options={opcionesGrupos}
                                            placeholder="SELECCIONA"
                                            value={opcionesGrupos.find((gr) => gr.value === formData.grupo)}
                                            isSearchable={true}
                                            onChange={(selectedOption) => setFormData({ ...formData, grupo: selectedOption.value })}
                                            styles={{
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "200px", // Limita la altura del dropdown
                                                    overflowY: "auto",  // Habilita scroll si hay muchos elementos
                                                }),
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                            }}
                                        />
                                        {errors.grupo && <div className="invalid-feedback">{errors.grupo}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Precio</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ height: 47 }}>$</span>
                                            <input
                                                type="text"
                                                name="precio"
                                                className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                                                value={formData.precio}
                                                onChange={handlePriceChange}
                                                onBlur={() => setFormData((prev) => ({ ...prev, precio: formatearDinero(prev.precio) }))}
                                                onFocus={() => setFormData((prev) => ({ ...prev, precio: prev.precio.replace(/[^0-9.]/g, "") }))}
                                            />
                                        </div>
                                        {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Unidad de Medida</label>
                                        <Select
                                            name="unidad_medida"
                                            options={opcionesUnidad}
                                            placeholder="SELECCIONA"
                                            value={opcionesUnidad.find((um) => um.value === formData.unidad_medida)}
                                            isSearchable={true}
                                            onChange={(selectedOption) => setFormData({ ...formData, unidad_medida: selectedOption.value })}
                                            styles={{
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "200px", // Limita la altura del dropdown
                                                    overflowY: "auto",  // Habilita scroll si hay muchos elementos
                                                }),
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                            }}
                                        />
                                        {errors.unidad_medida && <div className="invalid-feedback">{errors.unidad_medida}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Proveedor</label>
                                        <Select
                                            name="proveedores"
                                            options={proveedores.sort((a, b) => a.label.localeCompare(b.label))} // Ordenar alfabéticamente
                                            isMulti
                                            classNamePrefix="select"
                                            value={formData.proveedores.map((p) => ({ value: p, label: p }))} // Mantiene el formato esperado
                                            onChange={handleSelectChange}
                                            isSearchable={true}
                                            placeholder="SELECCIONA"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "130px", // Limita la altura del dropdown
                                                    overflowY: "auto",  // Habilita scroll si hay muchos elementos
                                                }),
                                            }}
                                        />

                                        {errors.proveedores && <div className="text-danger small">{errors.proveedores}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            className={`form-control ${errors.descripcion ? "is-valid" : ""}`}
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="modal-footer">
                                <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }}>
                                    Guardar
                                </Button>

                                <Button
                                    type="button"
                                    style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }}
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
    );
};