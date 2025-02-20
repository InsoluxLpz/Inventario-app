import { useState } from "react";
import { Button } from "@mui/material";
import { agregarProveedor } from "../../api/proovedoresApi";
import "../../styles/LoginScreen.css";

export const AgregarProveedoresModal = ({ onClose, modalOpen, agregarProveedorHandler}) => {
  if (!modalOpen) return null;

  const [formData, setFormData] = useState({
    nombreProveedor: "",
    telefonoContacto: "",
    rfc: "",
    telefonoEmpresa: "",
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
      setErrors({ nombreProveedor: "Error al agregar proveedor" });
      return;
    }
    agregarProveedorHandler(formData);
        onClose();
  };
  

  return (
    <div className="modal-backdrop">
      <div className="modal fade show" style={{ display: "block" }}>
        <div
          className="modal-dialog"
          style={{ maxWidth: "50vw", marginTop: 90 }}
        >
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#a93226" }}
            >
              <h5 className="modal-title" style={{ color: "white" }}>
                Agregar Proveedor
              </h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Proveedor</label>
                  <input
                    type="text"
                    name="nombreProveedor"
                    className={`form-control ${
                      errors.nombreProveedor ? "is-invalid" : ""
                    }`}
                    value={formData.nombreProveedor}
                    onChange={handleChange}
                  />
                  {errors.nombreProveedor && (
                    <div className="invalid-feedback">
                      {errors.nombreProveedor}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono de Contacto</label>
                  <input
                    type="text"
                    name="telefonoContacto"
                    className={`form-control ${
                      errors.telefonoContacto ? "is-invalid" : ""
                    }`}
                    value={formData.telefonoContacto}
                    onChange={handleChange}
                  />
                  {errors.telefonoContacto && (
                    <div className="invalid-feedback">
                      {errors.telefonoContacto}
                    </div>
                  )}
                </div>
                <div className="mb-3">
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
                <div className="mb-3">
                  <label className="form-label">Teléfono de la Empresa</label>
                  <input
                    type="text"
                    name="telefonoEmpresa"
                    className={`form-control ${
                      errors.telefonoEmpresa ? "is-invalid" : ""
                    }`}
                    value={formData.telefonoEmpresa}
                    onChange={handleChange}
                  />
                  {errors.telefonoEmpresa && (
                    <div className="invalid-feedback">
                      {errors.telefonoEmpresa}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  style={{ backgroundColor: "#a93226", color: "white" }}
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#28a745", color: "white" }}
                  onClick={handleSubmit}
                >
                  Agregar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
