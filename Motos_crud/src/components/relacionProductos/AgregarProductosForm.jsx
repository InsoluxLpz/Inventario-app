import React, { useEffect, useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material';
import { NavBar } from '../NavBar';
import Select from "react-select";
import { agregarProductos } from '../../api/productosApi';
import { obtenerProveedores } from '../../api/proveedoresApi';
import { useNavigate } from 'react-router';
import DesignServicesIcon from '@mui/icons-material/DesignServices';


export const AgregarProductosForm = () => {

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
  const handleNavigate = (path) => navigate(path);
  const navigate = useNavigate();


  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      if (data) {
        setProveedores(data.map((prov) => ({ value: prov.nombreProveedor, label: prov.nombreProveedor })));
      }
    };
    cargarProveedores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      proveedores: selectedOptions ? selectedOptions.map(option => option.value) : [],
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
        proveedores: [],
      });
      setErrors({});
      navigate("/Productos");
    } else if (nuevoProducto?.error) {
      setErrors((prev) => ({ ...prev, codigo: nuevoProducto.error }));
    }
  };

  return (
    <>
      <NavBar />
      <Button
        variant="contained"
        sx={{ backgroundColor: "#1f618d", color: "white", ":hover": { opacity: 0.7 }, position: "fixed", right: 50, top: 80, borderRadius: "8px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
        onClick={() => navigate("/Productos")}
      >
        <DesignServicesIcon sx={{ fontSize: 24 }} />
        Productos
      </Button>


      {/* Contenedor Principal del Formulario */}
      <div style={{ width: "100vw", height: "75vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", }}>

        <div
          style={{ backgroundColor: "#eaeded", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", maxWidth: "3000px", width: "90%", }}>

          <div
            style={{ backgroundColor: "#1f618d", padding: "15px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "flex-start", alignItems: "center", paddingLeft: "20px" }}>

            <h5 style={{ color: "white", margin: 0, fontSize: 24 }}>REGISTRAR PRODUCTO</h5>
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
                  {errors.codigo && (
                    <div className="invalid-feedback">{errors.codigo}</div>
                  )}
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
                  {errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Grupo</label>
                  <select
                    name="grupo"
                    className={`form-control ${errors.grupo ? "is-invalid" : ""}`}
                    value={formData.grupo}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      SELECCIONA
                    </option>
                    <option>FRENOS</option>
                    <option>LLANTAS</option>
                    <option>ACEITE</option>
                  </select>
                  {errors.grupo && (
                    <div className="invalid-feedback">{errors.grupo}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ height: 47 }}>
                      $
                    </span>
                    <input
                      type="number"
                      name="precio"
                      className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                      value={formData.precio}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.precio && (
                    <div className="invalid-feedback">{errors.precio}</div>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    className={`form-control ${errors.descripcion ? "is-valid" : ""
                      }`}
                    value={formData.descripcion}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unidad de Medida</label>
                  <select
                    name="unidad_medida"
                    className={`form-control ${errors.unidad_medida ? "is-invalid" : ""
                      }`}
                    value={formData.unidad_medida}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      SELECCIONA
                    </option>
                    <option>PIEZAS</option>
                    <option>CAJAS</option>
                    <option>LITROS</option>
                  </select>
                  {errors.unidad_medida && (
                    <div className="invalid-feedback">{errors.unidad_medida}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Proveedor</label>
                  <Select
                    name="proveedores"
                    options={proveedores}
                    isMulti
                    classNamePrefix="select"
                    value={formData.proveedores.map((p) => ({
                      value: p,
                      label: p,
                    }))}
                    onChange={handleSelectChange}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "45px",
                        height: "45px",
                      }),
                    }}
                  />
                  {errors.proveedores && (
                    <div className="text-danger small">{errors.proveedores}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="modal-footer ">
              <Button
                type="submit"
                style={{
                  backgroundColor: "#0091ea",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                Guardar
              </Button>

              <Button
                type="button"
                style={{
                  backgroundColor: "#85929e",
                  color: "white",
                  padding: "10px 20px",
                  margin: 20
                }}
                onClick={() => handleNavigate("/Productos")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
