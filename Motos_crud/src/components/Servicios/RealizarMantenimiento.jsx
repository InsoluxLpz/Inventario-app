import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { NavBar } from '../NavBar'
import Select from "react-select";
import { obtenerMotos } from '../../api/motosApi';
import { AgregarMantenimiento, ObtenerServicios } from '../../api/ServiciosApi';
import { AgregarRefaccionesModal } from './agregarRefaccionesModal';

export const RealizarMantenimiento = ({ modalOpen, onClose }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        fecha_inicio: "",
        vehiculo: "",
        odometro: "",
        servicio: [],
        refacciones_almacen: [],
        costo_total: "",
        comentario: "",
        status: "",
    });

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [motos, setMotos] = useState([]);
    const [servicio, setServicio] = useState([]);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    // Función para agregar un producto y actualizar el costo total
    const agregarProductoATabla = (productoData) => {
        setProductosSeleccionados((prevProductos) => {
            // Verificar si el producto ya está en la lista
            const productoExistente = prevProductos.find(p => p.producto === productoData.producto);

            let nuevosProductos;
            if (productoExistente) {
                // Si existe, actualizar la cantidad y el subtotal
                nuevosProductos = prevProductos.map(p =>
                    p.producto === productoData.producto
                        ? {
                            ...p,
                            cantidad: p.cantidad + productoData.cantidad,
                            subtotal: (p.cantidad + productoData.cantidad) * p.costo_unitario
                        }
                        : p
                );
            } else {
                // Si no existe, agregarlo normalmente
                nuevosProductos = [...prevProductos, productoData];
            }

            // Calcular el costo total de todos los productos
            const total = nuevosProductos.reduce((acc, prod) => acc + prod.subtotal, 0);

            // Actualizar el costo total en el estado de formData
            setFormData((prev) => ({ ...prev, costo_total: total.toFixed(2) }));

            return nuevosProductos;
        });
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const fetchMotos = async () => {
        const data = await obtenerMotos();
        if (data) {
            setMotos(data);
            console.log(data);
        }
    };

    const opcionesVehiculos = motos.map((moto) => ({
        value: moto.id,
        label: moto.inciso
    }));

    useEffect(() => {
        const cargarServicios = async () => {
            const data = await ObtenerServicios();
            console.log(data)
            if (data) {
                setServicio(data.map((serv) => ({ value: serv.id, label: serv.nombre })));
            }
        };
        cargarServicios();
        fetchMotos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData((prev) => ({
            ...prev,
            servicio: selectedOptions ? selectedOptions.map(option => option.value) : [], // Ahora usamos los IDs
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                if (formData[key].length === 0) {
                    newErrors[key] = "Este campo es obligatorio";
                }
            }
        });

        setErrors(newErrors);
        console.log("Errores de validación:", newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const nuevoMantenimiento = {
            fecha_inicio: formData.fecha_inicio,
            moto: formData.vehiculo,
            odometro: formData.odometro,
            costo: parseFloat(formData.costo_total) || 0,
            comentario: formData.comentario,
            idUsuario: 7,
            idCancelo: null,
            fecha_cancelacion: null,
            servicios: formData.servicio,
            productos: productosSeleccionados.map(prod => ({
                idProducto: prod.id, // Asegura que usa "id" en lugar de "producto"
                cantidad: prod.cantidad,
                costo: parseFloat(prod.costo_unitario) || 0,
                subtotal: parseFloat(prod.subtotal) || 0
            }))
        };



        console.log("Datos a enviar:", nuevoMantenimiento);

        const respuesta = await AgregarMantenimiento(nuevoMantenimiento);

        if (respuesta && !respuesta.error) {
            console.log("Mantenimiento agregado correctamente:", respuesta);

            setFormData({
                fecha_inicio: "",
                vehiculo: "",
                odometro: "",
                servicio: [],
                refacciones_almacen: [],
                costo_total: "",
                comentario: "",
                status: "",
            });
            setProductosSeleccionados([]);
            setErrors({});
        } else {
            console.error("Error al agregar mantenimiento:", respuesta.error);
        }
    };

    useEffect(() => {
        const total = productosSeleccionados.reduce((acc, prod) => acc + prod.subtotal, 0);
        setFormData((prev) => ({ ...prev, costo_total: total }));
    }, [productosSeleccionados]);


    return (
        <>
            <NavBar />
            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                        <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
                            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Realizar Servicio</h5>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} style={{ marginTop: 3 }}>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label">Fecha de inicio</label>
                                        <input name="fecha_inicio" type='date' className={`form-control form-control-sm ${errors.fecha_inicio ? "is-invalid" : ""}`} value={formData.fecha_inicio} onChange={handleChange} />
                                        {errors.fecha_inicio && <div className="invalid-feedback">{errors.fecha_inicio}</div>}
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Vehiculo</label>
                                        <Select
                                            name="vehiculo"
                                            options={opcionesVehiculos}
                                            placeholder="SELECCIONA"
                                            value={opcionesVehiculos.find((op) => op.value === formData.vehiculo)}
                                            onChange={(selectedOption) => setFormData({ ...formData, vehiculo: selectedOption.value })}
                                        />

                                        {errors.vehiculo && <div className="invalid-feedback">{errors.vehiculo}</div>}
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Odómetro/Horómetro</label>
                                        <input type="text" name="odometro" className={`form-control form-control-sm ${errors.odometro ? "is-invalid" : ""}`} value={formData.odometro} onChange={handleChange} />
                                        {errors.odometro && <div className="invalid-feedback">{errors.odometro}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-10 mb-2">
                                        <label className="form-label">Servicio(s)</label>
                                        <Select
                                            name="servicio"
                                            options={[...servicio].sort((a, b) => a.label.localeCompare(b.label))}
                                            isMulti
                                            placeholder="SELECCIONA"
                                            value={formData.servicio.map((s) => {
                                                const serv = servicio.find(serv => serv.value === s);
                                                return serv ? { value: serv.value, label: serv.label } : null;
                                            }).filter(Boolean)}
                                            onChange={handleSelectChange}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                }),
                                            }}
                                        />
                                        {errors.servicio && (
                                            <div className="text-danger">{errors.servicio}</div>
                                        )}
                                    </div>
                                </div>

                                <hr />
                                {/* Botón para agregar refacciones */}
                                <div className="d-flex justify-content-end mb-3">
                                    <Button variant="contained" color="primary" size="small" onClick={handleOpenModal}>
                                        Agregar Refacción
                                    </Button>
                                </div>

                                <h6 className="mb-2">Desglose de Partes/Refacciones de Almacén</h6>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Costo Unitario</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosSeleccionados.map((producto, index) => (
                                                <tr key={index}>
                                                    <td>{producto.producto}</td>
                                                    <td>${producto.costo_unitario}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>${producto.subtotal.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Costo Total</label>
                                        <input type="number" name="costo_refacciones" className={`form-control form-control-sm ${errors.costo_total ? "is-invalid" : ""}`} value={formData.costo_total} readOnly />
                                    </div>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <label className="form-label">Comentario</label>
                                    <textarea name="comentario" className={`form-control form-control-sm`} value={formData.comentario} onChange={handleChange} />
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
                            <AgregarRefaccionesModal onClose={handleCloseModal} modalOpen={isModalOpen} agregarProductoATabla={agregarProductoATabla} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
