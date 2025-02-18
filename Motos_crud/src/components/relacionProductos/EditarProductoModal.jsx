import { useEffect, useState } from "react";
import { actualizarProductos } from "../../api/productosApi";
import { Button } from "@mui/material";
import Swal from "sweetalert2";

export const EditarProductoModal = ({ onClose, modalOpen, producto, actualizarLista, listaGrupos }) => {
  if (!modalOpen) return null;

  const grupos = listaGrupos || [];

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    grupo: "",
    unidad_medida: "",
    precio: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || "",
        nombre: producto.nombre || "",
        grupo: producto.grupo || "",
        unidad_medida: producto.unidad_medida || "",
        precio: producto.precio || "",
        descripcion: producto.descripcion || "",
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.toString().trim()) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedProducto = await actualizarProductos(producto.id, formData);
      console.log("updatedProducto",updatedProducto)
      if (updatedProducto?.error) {
        setErrors({ general: "Error al actualizar el producto" });
        return;
      }

      Swal.fire("Éxito", "Producto actualizado correctamente.", "success");

      // Actualizar la lista de productos en el padre
      actualizarLista(updatedProducto);
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors({ general: "Error al conectar con el servidor" });
    }
  };

  return (
    <>
      {modalOpen && <div className="modal-backdrop"></div>}
      <div
        className={`modal fade ${modalOpen ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered mx-auto"
          role="document"
          style={{ maxWidth: "30vw" }}
        >
          <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
            <div
              className="modal-header"
              style={{ backgroundColor: "#a93226" }}
            >
              <h5 className="modal-title text-white">Editar Producto</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Código</label>
                    <input
                      type="text"
                      name="codigo"
                      className={`form-control ${
                        errors.codigo ? "is-invalid" : ""
                      }`}
                      value={formData.codigo}
                      onChange={handleChange}
                    />
                    {errors.codigo && (
                      <div className="invalid-feedback">{errors.codigo}</div>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className={`form-control ${
                        errors.nombre ? "is-invalid" : ""
                      }`}
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Grupo</label>
                    <select
                      name="grupo"
                      className={`form-control ${
                        errors.grupo ? "is-invalid" : ""
                      }`}
                      value={formData.grupo}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Selecciona un grupo
                      </option>
                      <option>FRENOS</option>
                      <option>LLANTAS</option>
                      <option>ACEITE</option>
                      {grupos.map((grupo, index) => (
                        <option key={index} value={grupo}>
                          {grupo}
                        </option>
                      ))}
                    </select>
                    {errors.grupo && (
                      <div className="invalid-feedback">{errors.grupo}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unidad de Medida</label>
                    <select
                      name="unidad_medida"
                      className={`form-control ${
                        errors.unidad_medida ? "is-invalid" : ""
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
                      <div className="invalid-feedback">
                        {errors.unidad_medida}
                      </div>
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
                        className={`form-control ${
                          errors.precio ? "is-invalid" : ""
                        }`}
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
                      className={`form-control ${
                        errors.descripcion ? "is-invalid" : ""
                      }`}
                      value={formData.descripcion}
                      onChange={handleChange}
                    ></textarea>
                    {errors.descripcion && (
                      <div className="invalid-feedback">
                        {errors.descripcion}
                      </div>
                    )}
                  </div>
                </div>
                {errors.general && (
                  <p className="text-danger">{errors.general}</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-warning">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
