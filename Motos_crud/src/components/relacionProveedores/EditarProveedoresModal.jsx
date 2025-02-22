import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { actualizarProovedor } from "../../api/proovedoresApi";
import "../../styles/LoginScreen.css";
import Swal from "sweetalert2";

export const EditarProveedoresModal = ({ onClose, modalOpen, proveedor, actualizarLista }) => {
  if (!modalOpen) return null;

  const [formData, setFormData] = useState({
    nombre_empresa: proveedor.nombre_empresa,
    nombreProveedor: proveedor.nombreProveedor,
    telefonoContacto: proveedor.telefonoContacto,
    rfc: proveedor.rfc,
    telefonoEmpresa: proveedor.telefonoEmpresa,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre_empresa: proveedor.nombre_empresa || "",
        nombreProveedor: proveedor.nombreProveedor || "",
        telefonoContacto: proveedor.telefonoContacto || "",
        rfc: proveedor.rfc || "",
        telefonoEmpresa: proveedor.telefonoEmpresa || "",
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    try {
      const updateProveedor = await actualizarProovedor(proveedor.id, formData);
      console.log("se actualizara el proveedor", updateProveedor)
      if (updateProveedor?.error) {
        setErrors({ general: "Error al actualizar el producto" });
        return;
      }
      Swal.fire("Éxito", "Proveedor actualizado correctamente.", "success");


      // Aquí iría la lógica para actualizar el proveedor en la base de datos
      actualizarLista(updateProveedor);
      onClose();
      console.log("Proveedor actualizado", updateProveedor);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors({ general: "Error al conectar con el servidor" });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document" style={{ maxWidth: "50vw", marginTop: 90 }}>
          <div className="modal-content w-100" style={{ maxWidth: "50vw" }}>
            <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
              <h5 className="modal-title" style={{ color: 'white' }}>Editar Proveedor</h5>
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
                    <label className="form-label">Nombre del Proveedor</label>
                    <input
                      type="text"
                      name="nombreProveedor"
                      className={`form-control ${errors.nombreProveedor ? "is-invalid" : ""
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
                </div>


                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono de Contacto</label>
                    <input
                      type="text"
                      name="telefonoContacto"
                      className={`form-control ${errors.telefonoContacto ? "is-invalid" : ""
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
                      type="text"
                      name="telefonoEmpresa"
                      className={`form-control ${errors.telefonoEmpresa ? "is-invalid" : ""
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
