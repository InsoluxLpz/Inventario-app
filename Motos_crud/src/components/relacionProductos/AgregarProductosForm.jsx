import React, { useState } from 'react'
import { Button } from '@mui/material';
import { NavBar } from '../NavBar';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';

export const AgregarProductosForm = () => {

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    grupo: "",
    precio: "",
    descripcion: "",
    unidad_medida: "",
    // proveedores: [],
  });

  const [errors, setErrors] = useState({});

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newValues = prev[name].includes(value)
        ? prev[name].filter((item) => item !== value) // Si ya está, lo elimina
        : [...prev[name], value]; // Si no está, lo agrega
      return { ...prev, [name]: newValues };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "descripcion" && key !== " proveedores") {
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
        // proveedor: [],
      });
      setErrors({});
    } else if (nuevoProducto?.error) {
      setErrors((prev) => ({ ...prev, codigo: nuevoProducto.error }));
    }
  };

  return (
    <>
      <NavBar />
      <div style={{ width: '100vw', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div className="w-100" style={{ maxWidth: "1700px", backgroundColor: "#f4f6f7 ", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ backgroundColor: '#a93226', padding: '10px', borderRadius: '5px 5px 0 0', marginBottom: 20 }}>
            <h5 style={{ color: 'white', margin: 0 }}>REGISTRAR PRODUCTO</h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Código</label>
                  <input type="taxt" name="codigo" className={`form-control ${errors.codigo ? "is-invalid" : ""}`} value={formData.codigo} onChange={handleChange} />
                  {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" name="nombre" className={`form-control ${errors.nombre ? "is-invalid" : ""}`} value={formData.nombre} onChange={handleChange} />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Grupo</label>
                  <select name="grupo" className={`form-control ${errors.grupo ? "is-invalid" : ""}`} value={formData.grupo} onChange={handleMultiSelectChange}>
                    <option value="" disabled>SELECCIONA</option>
                    <option>FRENOS</option>
                    <option>LLANTAS</option>
                    <option>ACEITE</option>
                  </select>
                  {errors.grupo && <div className="invalid-feedback">{errors.grupo}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ height: 47 }}>$</span>
                    <input
                      type="number"
                      name="precio"
                      className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                      value={formData.precio}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                </div>


                <div className="col-md-12 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" className={`form-control ${errors.descripcion ? "is-valid" : ""}`} value={formData.descripcion} onChange={handleChange}></textarea>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unidad de Medida</label>
                  <select name="unidad_medida" className={`form-control ${errors.unidad_medida ? "is-invalid" : ""}`} value={formData.unidad_medida} onChange={handleMultiSelectChange}>
                    <option value="" disabled>SELECCIONA</option>
                    <option >PIEZAS</option>
                    <option >CAJAS</option>
                    <option >LITROS</option>
                  </select>
                  {errors.unidad_medida && <div className="invalid-feedback">{errors.unidad_medida}</div>}
                </div>

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Proveedor</label>
                  <Select
                    name="proveedores" // Cambié 'proveedor' a 'proveedores'
                    options={[
                      { value: "Quaker", label: "Quaker" },
                      { value: "Truper", label: "Truper" },
                      { value: "Famsa", label: "Famsa" },
                    ]}
                    isMulti
                    className={`basic-multi-select`}
                    classNamePrefix="select"
                  />
                </div> */}
              </div>
            </div>
            {/* Botones */}
            <div className="modal-footer">
              {/* <Button type="button" style={{ backgroundColor: '#a93226', color: 'white' }} >Cancelar</Button> */}
              <Button
                type="submit"
                style={{
                  backgroundColor: '#f5b041',
                  color: 'white',
                  marginRight: 70,
                  padding: '12px 24px',
                  fontSize: '18px',
                  borderRadius: '5px',
                  position: 'relative',
                  left: '-20px',
                  top: '-10px',
                }}
                onClick={handleSubmit}
              >
                Guardar
              </Button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};
