import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@mui/material';
import { ActualizarMantenimiento } from '../../api/ServiciosApi';
import { cargarListasEntradas } from '../../api/almacenProductosApi';

export const EditarMantenimiento = ({ modalOpen, onClose, mantenimiento, listaMotos, listaServicios }) => {
    if (!modalOpen || !mantenimiento) return null;

    const motos = listaMotos;
    const Servicios = listaServicios;

    const formatFecha = (fecha) => {
        if (!fecha) return "";
        return fecha.split("T")[0];
    };

    const [formData, setFormData] = useState({
        fecha_inicio: "",
        idMoto: "",
        idAutorizo: "",
        odometro: "",
        servicio: [],
        productos: [],
        costo_total: "",
        comentario: "",
        status: "",
    });

    const [autorizaciones, setAutorizaciones] = useState([]);

    useEffect(() => {
        if (mantenimiento) {
            setFormData({
                fecha_inicio: formatFecha(mantenimiento.fecha_inicio),
                odometro: mantenimiento.odometro || "",
                idMoto: mantenimiento.idMoto || "",
                idAutorizo: mantenimiento.idAutorizo || "",
                servicio: mantenimiento.servicios.map(s => s.id) || [],
                productos: mantenimiento.productos || [],
                comentario: mantenimiento.comentario || "",
                costo_total: mantenimiento.costo_total || 0,
            });
        }
        console.log(mantenimiento)

    }, [mantenimiento]);

    useEffect(() => {
        const fetchAutorizo = async () => {
            const data = await cargarListasEntradas();
            if (data.autorizaciones) {
                const opciones = data.autorizaciones.map((a) => ({
                    value: a.idAutorizo,
                    label: a.nombre,
                }));
                setAutorizaciones(opciones);
            }
        };
        fetchAutorizo();
    }, []);


    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            if (key !== "nota" && (formData[key] === "" || formData[key] === null || formData[key] === undefined)) {
                newErrors[key] = "Este campo es obligatorio";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const MantenimientoData = {
            servicios: formData.servicio, // Solo los IDs de los servicios
        };

        const resultado = await ActualizarMantenimiento(mantenimiento.id, MantenimientoData);

        if (resultado && !resultado.error) {
            onClose(); // Cierra el modal tras éxito
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    const formatNumber = (value) => {
        return parseFloat(value).toLocaleString('es-MX'); // Formato para México (1,500.00)
    };

    const opcionesMotos = [...motos]
        .map((moto) => ({ value: moto.id, label: moto.inciso }));

    const opcionesServicios = [...Servicios]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((serv) => ({ value: serv.id, label: serv.nombre }));

    return (
        <>
            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
                        <div className="modal-content w-100">
                            <div className="modal-header" style={{ backgroundColor: '#f1c40f' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Actualizar Servicio</h5>
                            </div>

                            <form style={{ marginTop: 3 }} onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label">Fecha de inicio</label>
                                        <input
                                            name="fecha_inicio"
                                            type='date'
                                            className="form-control form-control-sm"
                                            value={formData.fecha_inicio}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Moto</label>
                                        <input
                                            type="text"
                                            name="idMoto"
                                            className="form-control form-control-sm"
                                            value={opcionesMotos.find(op => op.value === formData.idMoto)?.label || ""}
                                            readOnly
                                        />

                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Odómetro/Horómetro</label>
                                        <input
                                            type="text"
                                            name="odometro"
                                            className="form-control form-control-sm"
                                            value={new Intl.NumberFormat('es-MX').format(formData.odometro)}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-10 mb-2">
                                        <label className="form-label">Servicio(s)</label>
                                        <Select
                                            name="servicio"
                                            options={opcionesServicios}
                                            placeholder="SELECCIONA"
                                            isMulti // Permitir múltiples selecciones
                                            value={opcionesServicios.filter(op => formData.servicio.includes(op.value))} // Filtrar por IDs seleccionados
                                            onChange={(selectedOptions) => {
                                                setFormData({
                                                    ...formData,
                                                    servicio: selectedOptions.map(op => op.value) // Guardar solo los IDs seleccionados
                                                });
                                            }}
                                        />

                                    </div>
                                </div>

                                <hr />

                                <h6 className="mb-2">Desglose de Partes/Refacciones de Almacén</h6>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "left", width: "16.66%" }}>Producto</th>
                                                <th style={{ textAlign: "left", width: "16.66%" }}>Costo Unitario</th>
                                                <th style={{ textAlign: "left", width: "16.66%" }}>Cantidad</th>
                                                <th style={{ textAlign: "left", width: "16.66%" }}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.productos.map((producto, index) => (
                                                <tr key={index}>
                                                    <td style={{ textAlign: "left", width: "16.66%" }}>{producto.nombre}</td>
                                                    <td style={{ textAlign: "left", width: "16.66%" }}>${formatNumber(producto.costo)}</td>
                                                    <td style={{ textAlign: "left", width: "16.66%" }}>{producto.cantidad}</td>
                                                    <td style={{ textAlign: "left", width: "16.66%" }}>${formatNumber(producto.costo * producto.cantidad)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Autorizó</label>
                                        <input
                                            type="text"
                                            name="idAutorizo"
                                            className="form-control form-control-sm"
                                            value={autorizaciones.find(op => op.value === formData.idAutorizo)?.label || ""}
                                            readOnly
                                        />

                                    </div>
                                    <div className="col-md-2 offset-md-6">
                                        <label className="form-label">Costo Total</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ height: 47 }}>
                                                $
                                            </span>
                                            <input
                                                type="text"
                                                name="costo_refacciones"
                                                className="form-control"
                                                value={new Intl.NumberFormat('es-MX').format(formData.costo_total)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <label className="form-label">Comentario</label>
                                    <textarea
                                        name="comentario"
                                        className="form-control form-control-sm"
                                        value={formData.comentario}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>

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
        </>
    );
};