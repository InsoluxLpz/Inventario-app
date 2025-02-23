import { useEffect, useState } from "react";
import { actualizarProductos } from "../../api/productosApi";
import { Button } from "@mui/material";
import { obtenerProveedores } from '../../api/proveedoresApi';
import Select from "react-select";
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
    proveedores: [],
  });

  const [errors, setErrors] = useState({});
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      if (data) {
        setProveedores(data.map((prov) => ({ value: prov.nombreProveedor, label: prov.nombreProveedor })));
      }
    };
    cargarProveedores();
  }, []);

  useEffect(() => {
    if (producto) {
      console.log("Producto cargado:", producto); // Verifica si producto se carga correctamente

      // Asegurar que `producto.proveedores` es un array válido
      const proveedoresArray = producto.proveedores
        ? typeof producto.proveedores === "string"
          ? producto.proveedores.split(", ").map((p) => ({ value: p, label: p }))
          : producto.proveedores.map((p) => ({ value: p, label: p }))
        : [];

      setFormData((prev) => ({
        ...prev,
        codigo: producto.codigo || "",
        nombre: producto.nombre || "",
        grupo: producto.grupo || "",
        unidad_medida: producto.unidad_medida || "",
        precio: producto.precio || "",
        descripcion: producto.descripcion || "",
        proveedores: proveedoresArray, // Actualizar con los proveedores correctos
      }));
    }
  }, [producto]); // Agregar `producto.proveedores` puede ayudar si se actualiza en el padre



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      proveedores: selectedOptions || [], // Guardar la estructura { value, label }
    }));
    setErrors((prev) => ({ ...prev, proveedores: "" }));
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
      if (updatedProducto?.error) {
        setErrors({ general: "Error al actualizar el producto" });
        return;
      }

      Swal.fire("Éxito", "Producto actualizado correctamente.", "success");

      actualizarLista(updatedProducto);

      // 🔹 Forzar actualización del modal antes de cerrarlo
      setTimeout(() => onClose(), 300);

    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors({ general: "Error al conectar con el servidor" });
    }
  };


  return (
    <>
      <div className="modal-backdrop">
        <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document" style={{ maxWidth: "60vw", marginTop: 90 }}>
            <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
              <div className="modal-header" style={{ backgroundColor: '#1f618d' }}>
                <h5 className="modal-title" style={{ color: 'white' }}>Agregar Producto</h5>
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
                        <option>ACEITE</option>
                        <option>FRENOS</option>
                        <option>LLANTAS</option>
                      </select>
                      {errors.grupo && (
                        <div className="invalid-feedback">{errors.grupo}</div>
                      )}
                    </div>
                    {/* <div className="col-md-6 mb-3">
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
                    </div> */}

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
                        <option>CAJAS</option>
                        <option>LITROS</option>
                        <option>PIEZAS</option>
                      </select>
                      {errors.unidad_medida && (
                        <div className="invalid-feedback">{errors.unidad_medida}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Proveedor</label>
                      <Select
                        name="proveedores"
                        options={proveedores.sort((a, b) => a.label.localeCompare(b.label))}
                        isMulti
                        classNamePrefix="select"
                        value={formData.proveedores} // Se asegura que sean { value, label }
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
                <div className="modal-footer">
                  <Button type="submit" style={{ backgroundColor: "#f1c40f", color: "white" }} onClick={handleSubmit}>
                    Guardar
                  </Button>

                  <Button type="button" style={{ backgroundColor: "#7f8c8d", color: "white", marginLeft: 7 }} onClick={onClose}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
