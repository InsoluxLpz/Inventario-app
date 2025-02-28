import { useState } from "react";
import { Button } from "@mui/material";
import { agregarProveedor } from "../../api/proovedoresApi";
import "../../styles/LoginScreen.css";

export const AgregarProveedoresModal = ({ onClose, modalOpen, agregarProveedorHandler }) => {
  if (!modalOpen) return null;

  const [formData, setFormData] = useState({
    nombre_empresa: "",
    nombre_proveedor: "",
    rfc: "",
    telefono_contacto: "",
    telefono_empresa: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await agregarProveedor(formData);
    if (result && result.error) {
      setErrors({ nombre_proveedor: "Error al agregar proveedor" });
      return;
    }
    agregarProveedorHandler(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document" style={{ maxWidth: "50vw", marginTop: 90 }}>
          <div className="modal-content w-100" style={{ maxWidth: "50vw" }}>
            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
              <h5 className="modal-title" style={{ color: 'white' }}>Agregar Proveedor</h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Empresa</label>
                    <input
                      type="text"
                      name="nombre_empresa"
                      className={`form-control ${errors.nombre_empresa ? "is-invalid" : ""
                        }`}
                      value={formData.nombre_empresa}
                      onChange={handleChange}
                    />
                    {errors.nombre_empresa && (
                      <div className="invalid-feedback">
                        {errors.nombre_empresa}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre Proveedor</label>
                    <input
                      type="text"
                      name="nombre_proveedor"
                      className={`form-control ${errors.nombre_proveedor ? "is-invalid" : ""
                        }`}
                      value={formData.nombre_proveedor}
                      onChange={handleChange}
                    />
                    {errors.nombre_proveedor && (
                      <div className="invalid-feedback">
                        {errors.nombre_proveedor}
                      </div>
                    )}
                  </div>
                </div>


                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono de Contacto</label>
                    <input
                      type="number"
                      name="telefono_contacto"
                      className={`form-control ${errors.telefono_contacto ? "is-invalid" : ""
                        }`}
                      value={formData.telefono_contacto}
                      onChange={handleChange}
                    />
                    {errors.telefono_contacto && (
                      <div className="invalid-feedback">
                        {errors.telefono_contacto}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">RFC</label>
                    <input
                      type="text"
                      name="rfc"
                      className={`form-control ${errors.rfc ? "is-invalid" : ""}`}
                      value={formData.rfc}
                      onChange={handleChange}
                    />
                    {errors.rfc && (
                      <div className="invalid-feedback">{errors.rfc}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono de la Empresa</label>
                    <input
                      type="number"
                      name="telefono_empresa"
                      className={`form-control ${errors.telefono_empresa ? "is-invalid" : ""
                        }`}
                      value={formData.telefono_empresa}
                      onChange={handleChange}
                    />
                    {errors.telefono_empresa && (
                      <div className="invalid-feedback">
                        {errors.telefono_empresa}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  type="submit"
                  style={{ backgroundColor: "#f1c40f", color: "white" }}
                  onClick={handleSubmit}
                >
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
