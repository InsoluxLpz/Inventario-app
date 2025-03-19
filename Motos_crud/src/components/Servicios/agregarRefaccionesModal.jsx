
import { Button } from "@mui/material";
import { obtenerProductos } from "../../api/productosApi";
import { useEffect, useState } from "react";
import Select from "react-select";

export const AgregarRefaccionesModal = ({ onClose, modalOpen, agregarProductoATabla }) => {
    if (!modalOpen) return null;

    const [formData, setFormData] = useState({
        producto: "",
        cantidad: "",
        precioTotal: 0,
    });

    const [refacciones, setRefacciones] = useState([]);
    const [errors, setErrors] = useState({});
    const [stockDisponible, setStockDisponible] = useState({});


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

            if (name === "producto") {
                const productoSeleccionado = refacciones.find((p) => p.nombre === value);
                if (productoSeleccionado) {
                    nuevoEstado.precioTotal = productoSeleccionado.precio * (prev.cantidad || 1);
                    setStockDisponible(productoSeleccionado.stock_disponible); // Guardamos el stock disponible
                }
            }

            if (name === "cantidad") {
                const cantidadIngresada = Number(value);
                if (cantidadIngresada > stockDisponible) {
                    setErrors((prev) => ({ ...prev, cantidad: "Cantidad excede el stock disponible" }));
                } else {
                    setErrors((prev) => ({ ...prev, cantidad: "" }));
                }
                nuevoEstado.precioTotal = (prev.producto ? refacciones.find((p) => p.nombre === prev.producto).precio : 0) * cantidadIngresada;
            }

            return nuevoEstado;
        });
    };

    const opcionesProductos = [...refacciones]
        .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Orden alfabético
        .map((prod) => ({
            value: prod.nombre,
            label: `${prod.nombre} - $${prod.precio}` // Muestra el nombre y el precio
        }));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.producto) newErrors.producto = "Elige un producto";
        if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = "Ingresa una cantidad válida";
        if (formData.cantidad > stockDisponible) newErrors.cantidad = "Cantidad excede el stock disponible";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const productoSeleccionado = refacciones.find((p) => p.nombre === formData.producto);
        if (!productoSeleccionado) return;

        const productoData = {
            id: productoSeleccionado.id,
            producto: formData.producto,
            cantidad: Number(formData.cantidad),
            costo_unitario: productoSeleccionado.precio,
            subtotal: productoSeleccionado.precio * Number(formData.cantidad),
        };

        agregarProductoATabla(productoData);

        setFormData({
            producto: "",
            cantidad: "",
            precioTotal: 0,
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{ maxWidth: "20vw", marginTop: 90 }}>
                    <div className="modal-content w-90" style={{ maxWidth: "60vw" }}>
                        <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                            <h5 className="modal-title" style={{ color: 'white' }}>Agregar Mantenimiento</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    {/* Selección de Producto */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Artículo del almacén</label>
                                        <Select
                                            name="producto"
                                            classNamePrefix="select"
                                            options={opcionesProductos}
                                            value={opcionesProductos.find((op) => op.value === formData.producto)} // Selección actual
                                            onChange={(selectedOption) => setFormData({ ...formData, producto: selectedOption.value })}
                                            isSearchable={true} // Permite buscar
                                            placeholder="SELECCIONA"
                                            styles={{
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "130px", // Limita la altura del dropdow
                                                    overflowY: "auto",  // Habilita scroll si hay muchos elementos
                                                }),
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: "45px",
                                                    height: "45px",
                                                }),
                                            }}
                                        />
                                        {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}
                                    </div>

                                    {/* Cantidad */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Cantidad</label>
                                        <input type="number" name="cantidad" className={`form-control ${errors.cantidad ? "is-invalid" : ""}`} onChange={handleChange} value={formData.cantidad} />
                                        {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
                                    </div>


                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }} onClick={handleSubmit}>
                                    Agregar
                                </Button>

                                <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }} onClick={onClose}>
                                    Salir
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
