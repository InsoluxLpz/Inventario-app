// import { Button } from '@mui/material';
// import React, { useEffect, useState } from 'react'
// import { NavBar } from '../NavBar';
// import { obtenerProveedores } from '../../api/proveedoresApi';
// import { agregarEntradas, obtenerProductos } from '../../api/productosApi';


// export const EntradasAlmacenModal = () => {

//     const [errors, setErrors] = useState({});
//     const [proveedores, setProveedores] = useState([]);
//     const [productos, setProductos] = useState([]);
//     const [formData, setFormData] = useState({
//         producto: "",
//         fecha: "",
//         cantidad: "",
//         costo_unitario: "",
//         tipo: "",
//         autorizo: "",
//         proveedor: [],
//     });


//     const fetchProductos = async () => {
//         const data = await obtenerProductos();
//         if (data) {
//             setProductos(data);
//             console.log(data);
//         }
//     };

//     useEffect(() => {
//         const cargarProveedores = async () => {
//             const data = await obtenerProveedores();
//             console.log(data)
//             if (data) {
//                 setProveedores(data.map((prov) => ({ value: prov.nombreProveedor, label: prov.nombreProveedor })));
//             }
//         };
//         cargarProveedores();
//         fetchProductos()
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//     };

//     const handleSelectChange = (selectedOptions) => {
//         setFormData((prev) => ({
//             ...prev,
//             proveedor: selectedOptions ? selectedOptions.map(option => option.value) : [],
//         }));
//         setErrors((prev) => ({ ...prev, proveedor: "" }));
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         Object.keys(formData).forEach((key) => {

//             if (Array.isArray(formData[key])) {
//                 if (formData[key].length === 0) {
//                     newErrors[key] = "Este campo es obligatorio";
//                 }
//             }
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;
//         const nuevoEntrada = await agregarEntradas(formData);

//         if (nuevoEntrada && !nuevoEntrada.error) {
//             console.log(nuevoEntrada);
//             setFormData({
//                 producto: "",
//                 fecha: "",
//                 cantidad: "",
//                 costo_unitario: "",
//                 tipo: "",
//                 autorizo: "",
//                 proveedor: [],
//             });
//             setErrors({});
//         }
//     };


//     return (
//         <>
//             <NavBar />

//             <div className="modal-backdrop">
//                 <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
//                     <div className="modal-dialog" role="document" style={{ maxWidth: "70vw", marginTop: 90 }}>
//                         <div className="modal-content w-100" style={{ maxWidth: "70vw" }}>
//                             <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
//                                 <h5 className="modal-title" style={{ color: 'white' }}>Agregar Entrada</h5>
//                             </div>

//                             <form style={{ padding: "20px", maxHeight: "300vh" }}>
//                                 <div className="modal-body">
//                                     <div className="row">
//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Fecha</label>
//                                             <input type="date" name="fecha" className={`form-control`} />
//                                         </div>

//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Cantidad</label>
//                                             <input type="number" name="Cantidad" className={`form-control `} />
//                                         </div>

//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Costo Unitario</label>
//                                             <input type="number" name="costo_unitario" className={`form-control `} />
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Producto</label>
//                                             <select name="producto" className={`form-control ${errors.producto ? "is-invalid" : ""}`} onChange={handleChange} value={formData.producto}>
//                                                 <option value="" disabled>SELECCIONA</option>
//                                                 {productos.map((prod) => (
//                                                     <option key={prod.id} value={prod.nombre}>
//                                                         {prod.nombre}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}
//                                         </div>

//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Tipo</label>
//                                             <select
//                                                 name="tipo"
//                                                 className={`form-control `}
//                                             >
//                                                 <option value="" disabled>Selecciona</option>
//                                                 <option value="0">Compra</option>
//                                                 <option value="1">Ajuste</option>
//                                                 <option value="2">Traspaso</option>
//                                                 <option value="3">Devolución</option>
//                                             </select>
//                                         </div>

//                                         <div className="col-md-4 mb-3">
//                                             <label className="form-label">Autorizo</label>
//                                             <select
//                                                 name="autorizo"
//                                                 className={`form-control `}
//                                             >
//                                                 <option value="" disabled>Selecciona</option>
//                                                 <option value="0">Guillermo Humberto Alonso Estrada</option>
//                                                 <option value="1">Giovanni Ortega</option>
//                                                 <option value="2">Carlos Eduardo Leal Perez</option>
//                                                 <option value="3">Accidente o Tránsito</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">Proveedor</label>
//                                             <select
//                                                 name="proveedor"
//                                                 className={`form-control `}
//                                             >
//                                                 <option value="" disabled>Selecciona</option>
//                                                 <option value="0">Inactiva</option>
//                                                 <option value="1">Activa</option>
//                                                 <option value="2">Taller</option>
//                                                 <option value="3">Accidente o Tránsito</option>
//                                             </select>
//                                         </div>

//                                     </div>

//                                     <div className="modal-footer">
//                                         <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }}>
//                                             Guardar
//                                         </Button>

//                                         <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }}>
//                                             Cancelar
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };




import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavBar } from '../NavBar';
import { obtenerProveedores } from '../../api/proveedoresApi';
import { agregarEntradas, obtenerProductos } from '../../api/productosApi';

export const EntradasAlmacenModal = () => {
    const [formData, setFormData] = useState({
        producto: "",
        fecha: "",
        cantidad: "",
        costo_unitario: "",
        tipo: "",
        autorizo: "",
        proveedor: [],
    });

    const [errors, setErrors] = useState({});
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);

    const fetchProductos = async () => {
        const data = await obtenerProductos();
        if (data) {
            setProductos(data);
        }
    };

    useEffect(() => {
        const cargarProveedores = async () => {
            const data = await obtenerProveedores();
            if (data) {
                setProveedores(data.map((prov) => ({ value: prov.nombreProveedor, label: prov.nombreProveedor })));
            }
        };
        cargarProveedores();
        fetchProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                if (formData[key].length === 0) {
                    newErrors[key] = "Este campo es obligatorio";
                }
            } else if (!formData[key]) {
                newErrors[key] = "Este campo es obligatorio";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        const nuevoEntrada = await agregarEntradas(formData);

        if (nuevoEntrada && !nuevoEntrada.error) {
            setFormData({
                producto: "",
                fecha: "",
                cantidad: "",
                costo_unitario: "",
                tipo: "",
                autorizo: "",
                proveedor: [],
            });
            setErrors({});
        }
    };

    return (
        <>
            <NavBar />
            <div className="modal-backdrop">
                <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ maxWidth: "70vw", marginTop: 90 }}>
                        <div className="modal-content w-100" style={{ maxWidth: "70vw" }}>
                            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                                <h5 className="modal-title" style={{ color: 'white' }}>Agregar Entrada</h5>
                            </div>

                            <form onSubmit={handleSubmit} style={{ padding: "20px", maxHeight: "300vh" }}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input type="date" name="fecha" className={`form-control`} value={formData.fecha} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Cantidad</label>
                                            <input type="number" name="cantidad" className={`form-control`} value={formData.cantidad} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Costo Unitario</label>
                                            <input type="number" name="costo_unitario" className={`form-control`} value={formData.costo_unitario} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Producto</label>
                                            <select
                                                name="producto"
                                                className={`form-control ${errors.producto ? "is-invalid" : ""}`}
                                                value={formData.producto}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>SELECCIONA</option>
                                                {productos.map((prod) => (
                                                    <option key={prod.id} value={prod.nombre}>
                                                        {prod.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Tipo</label>
                                            <select
                                                name="tipo"
                                                className={`form-control ${errors.tipo ? "is-invalid" : ""}`}
                                                value={formData.tipo}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>Selecciona</option>
                                                <option value="0">Compra</option>
                                                <option value="1">Ajuste</option>
                                                <option value="2">Traspaso</option>
                                                <option value="3">Devolución</option>
                                            </select>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Autorizo</label>
                                            <select
                                                name="autorizo"
                                                className={`form-control ${errors.autorizo ? "is-invalid" : ""}`}
                                                value={formData.autorizo}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>Selecciona</option>
                                                <option value="0">Guillermo Humberto Alonso Estrada</option>
                                                <option value="1">Giovanni Ortega</option>
                                                <option value="2">Carlos Eduardo Leal Perez</option>
                                                <option value="3">Accidente o Tránsito</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Proveedor</label>
                                            <select
                                                name="proveedor"
                                                className={`form-control ${errors.proveedor ? "is-invalid" : ""}`}
                                                value={formData.proveedor}
                                                onChange={handleSelectChange}
                                            >
                                                <option value="" disabled>Selecciona</option>
                                                {proveedores.map((prov) => (
                                                    <option key={prov.value} value={prov.value}>
                                                        {prov.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }}>
                                            Guardar
                                        </Button>

                                        <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
