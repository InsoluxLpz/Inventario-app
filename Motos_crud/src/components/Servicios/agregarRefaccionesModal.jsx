
import { Button } from "@mui/material";
import { obtenerProductos } from "../../api/productosApi";
import { useEffect, useState } from "react";

export const AgregarRefaccionesModal = ({ onClose, modalOpen, agregarProductoATabla }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        producto: "",
        cantidad: "",
        precioTotal: 0,
    });

    const [refacciones, setRefacciones] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProductos = async () => {
            const data = await obtenerProductos();
            if (data) {
                setRefacciones(data);
                console.log(data);
            }
        };
        fetchProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            let nuevoEstado = { ...prev, [name]: value };

            // Si cambia el producto, recalcular el precio total
            if (name === "producto") {
                const productoSeleccionado = refacciones.find((p) => p.nombre === value);
                if (productoSeleccionado) {
                    nuevoEstado.precioTotal = productoSeleccionado.precio * (prev.cantidad || 1);
                }
            }

            // Si cambia la cantidad, recalcular el precio total
            if (name === "cantidad") {
                const productoSeleccionado = refacciones.find((p) => p.nombre === prev.producto);
                if (productoSeleccionado) {
                    nuevoEstado.precioTotal = productoSeleccionado.precio * value;
                }
            }

            return nuevoEstado;
        });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.producto) newErrors.producto = "Elige un producto";
        if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = "Ingresa una cantidad válida";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Llamar a la función que agrega a la tabla
        agregarProductoATabla(formData);

        setFormData({
            producto: "",
            cantidad: "",
            precioTotal: 0,
        });

        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{ maxWidth: "20vw", marginTop: 100 }}>
                    <div className="modal-content " style={{ maxWidth: "60vw" }}>
                        <div className="modal-header" style={{ backgroundColor: '#a93226' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Agregar Partes/Refacciones</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    {/* Selección de Producto */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Artículo del almacén</label>
                                        <select name="producto" className={`form-control ${errors.producto ? "is-invalid" : ""}`} onChange={handleChange} value={formData.producto}>
                                            <option value="" disabled>SELECCIONA</option>
                                            {refacciones.map((prod) => (
                                                <option key={prod.id} value={prod.nombre}>
                                                    {prod.nombre} - ${prod.precio}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}
                                    </div>

                                    {/* Cantidad */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Cantidad</label>
                                        <input type="number" name="cantidad" className={`form-control ${errors.cantidad ? "is-invalid" : ""}`} onChange={handleChange} value={formData.cantidad} />
                                        {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
                                    </div>

                                    {/* Precio Total */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Precio Total</label>
                                        <input type="text" className="form-control" value={`$${formData.precioTotal}`} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button type="button" style={{ backgroundColor: '#a93226', color: 'white' }} onClick={onClose}>Cancelar</Button>
                                <Button type="submit" style={{ backgroundColor: '#f5b041', marginLeft: 5, color: 'white' }}>Guardar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
