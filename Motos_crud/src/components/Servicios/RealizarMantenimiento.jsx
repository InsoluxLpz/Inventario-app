import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { NavBar } from '../NavBar'
import Select from "react-select";
import { useNavigate } from 'react-router';
import { obtenerMotos } from '../../api/motosApi';
import { AgregarMantenimiento, ObtenerServicios } from '../../api/ServiciosApi';
import { AgregarRefaccionesModal } from './agregarRefaccionesModal';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

export const RealizarMantenimiento = ({ modalOpen, onClose }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        fecha_inicio: "",
        vehiculo: "",
        odometro: "",
        servicio: [],
        refacciones_almacen: "",
        costo_refacciones: "",
        costo_total: "",
        comentario: "",
        status: "",
    });

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [motos, setMotos] = useState([]);
    const [servicio, setServicio] = useState([]);
    const handleNavigate = (path) => navigate(path);
    const navigate = useNavigate();

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const agregarProductoATabla = (nuevoProducto) => {
        const productosActualizados = [...productosSeleccionados, nuevoProducto];
        setProductosSeleccionados(productosActualizados);

        // Calcular el costo total de refacciones
        const costoRefacciones = productosActualizados.reduce((total, producto) => total + parseFloat(producto.precioTotal), 0);

        // Obtener solo los nombres de los productos seleccionados
        const nombresProductos = productosActualizados.map(prod => prod.producto).join(", ");

        // Actualizar los estados correspondientes
        setFormData(prevState => ({
            ...prevState,
            refacciones_almacen: nombresProductos,  // Ahora se guarda la lista de nombres
            costo_refacciones: costoRefacciones,
            costo_total: costoRefacciones
        }));
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

    useEffect(() => {
        const cargarServicios = async () => {
            const data = await ObtenerServicios();
            console.log(data)
            if (data) {
                setServicio(data.map((prov) => ({ value: prov.nombre, label: prov.nombre })));
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
            servicio: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
        setErrors((prev) => ({ ...prev, servicio: "" }));
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
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        const nuevoMantenimiento = await AgregarMantenimiento(formData);

        if (nuevoMantenimiento && !nuevoMantenimiento.error) {
            console.log(nuevoMantenimiento);
            setFormData({
                fecha_inicio: "",
                vehiculo: "",
                odometro: "",
                servicio: [],
                refacciones_almacen: "",
                costo_refacciones: "",
                costo_total: "",
                comentario: "",
                status: "",
            });
            setErrors({});
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
                                <h5 className="modal-title" style={{ color: 'white' }}>Agregar Moto</h5>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} style={{ marginTop: 3 }}>
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <label className="form-label small">Fecha de inicio</label>
                                        <input name="fecha_inicio" type='date' className={`form-control form-control-sm ${errors.fecha_inicio ? "is-invalid" : ""}`} value={formData.fecha_inicio} onChange={handleChange} />
                                        {errors.fecha_inicio && <div className="invalid-feedback">{errors.fecha_inicio}</div>}
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label">Vehiculo</label>
                                        <select
                                            name="vehiculo"
                                            className={`form-control ${errors.vehiculo ? "is-invalid" : ""}`}
                                            value={formData.vehiculo}
                                            onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value })}
                                        >
                                            <option value="" disabled>Selecciona</option>
                                            {motos.map((moto) => (
                                                <option key={moto.id} value={moto.inciso}>{moto.inciso}</option>
                                            ))}
                                        </select>
                                        {errors.vehiculo && <div className="invalid-feedback">{errors.vehiculo}</div>}
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <label className="form-label small">Odómetro/Horómetro</label>
                                        <input type="text" name="odometro" className={`form-control form-control-sm ${errors.odometro ? "is-invalid" : ""}`} value={formData.odometro} onChange={handleChange} />
                                        {errors.odometro && <div className="invalid-feedback">{errors.odometro}</div>}
                                    </div>
                                </div>

                                {/* Segunda fila */}
                                <div className="row">
                                    <div className="col-md-10 mb-2">
                                        <label className="form-label small">Servicio(s)</label>
                                        <Select
                                            name="servicio"
                                            options={servicio}
                                            isMulti
                                            classNamePrefix="select"
                                            value={formData.servicio.map((s) => ({ value: s, label: s, }))}
                                            onChange={handleSelectChange}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                            }}
                                        />
                                        {errors.servicio && (
                                            <div className="text-danger small">{errors.servicio}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Línea divisoria */}
                                <hr />

                                <h6 className="mb-2">Desglose de Partes/Refacciones de Almacén</h6>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosSeleccionados.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.producto}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>${item.precioTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Botón para agregar refacciones */}
                                <div className="d-flex justify-content-start mb-3">
                                    <Button variant="contained" color="primary" size="small" onClick={handleOpenModal}>
                                        Agregar Refacción
                                    </Button>
                                </div>

                                {/* Totales */}
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label small">Costo Partes/Refacciones</label>
                                        <input type="number" name="costo_refacciones" className={`form-control form-control-sm ${errors.costo_refacciones ? "is-invalid" : ""}`} value={formData.costo_refacciones} onChange={handleChange} />
                                        {errors.costo_refacciones && <div className="invalid-feedback">{errors.costo_refacciones}</div>}
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label small">Costo Total</label>
                                        <input type="number" name="costo_total" className={`form-control form-control-sm ${errors.costo_total ? "is-invalid" : ""}`} value={formData.costo_total} onChange={handleChange} />
                                        {errors.costo_total && <div className="invalid-feedback">{errors.costo_total}</div>}
                                    </div>
                                </div>

                                {/* Comentarios */}
                                <div className="col-md-12 mb-2">
                                    <label className="form-label small">Comentario</label>
                                    <textarea name="comentario" className={`form-control form-control-sm`} value={formData.comentario} onChange={handleChange} />
                                </div>

                                {/* Botones de acción */}
                                <div className="modal-footer ">
                                    <Button type="submit" style={{ backgroundColor: "#0091ea", color: "white", padding: "10px 20px", }} onClick={handleSubmit} >
                                        Guardar
                                    </Button>

                                    <Button type="button" style={{ backgroundColor: "#85929e", color: "white", padding: "10px 20px", margin: 20 }} onClick={onClose}>
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
}