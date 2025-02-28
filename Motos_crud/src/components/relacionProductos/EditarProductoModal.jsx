import { useEffect, useState } from "react";
import { actualizarProductos } from "../../api/productosApi";
import { Button } from "@mui/material";
import { obtenerProveedores } from "../../api/proveedoresApi";
import Select from "react-select";
import Swal from "sweetalert2";

export const EditarProductoModal = ({ onClose, modalOpen, producto, actualizarLista, listagrupos, unidadMedida, ListaProveedores }) => {
  if (!modalOpen) return null;

  const grupos = listagrupos;
  const unidad = unidadMedida;
  const Proveedor = ListaProveedores;

  console.log(Proveedor)

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
  useEffect(() => {
    if (producto) {
      console.log("Producto cargado:", producto);

      // Asegurar que `producto.proveedores` es un array de objetos con value: id y label: nombre
      const proveedoresArray = producto.proveedores
        ? producto.proveedores.split(", ").map((p) => {
          const [id, nombre] = p.split(":"); // Dividir el ID y el nombre (asumiendo el formato 'id:nombre')
          return { value: id, label: nombre }; // Crear un objeto con el ID y el nombre
        })
        : [];

      setFormData((prev) => ({
        ...prev,
        codigo: producto.codigo || "",
        nombre: producto.nombre || "",
        grupo: producto.idGrupo || "",
        unidad_medida: producto.idUnidadMedida || "",
        precio: producto.precio || "",
        descripcion: producto.descripcion || "",
        proveedores: producto.proveedores
          ? producto.proveedores.map(prov => ({ value: prov.id, label: prov.nombre }))
          : [],

      }));
    }
  }, [producto]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (selectedOptions) => {
    // Solo almacenamos los IDs de los proveedores seleccionados
    setFormData((prev) => ({
      ...prev,
      proveedores: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [], // Guardamos solo los IDs
    }));
    setErrors((prev) => ({ ...prev, proveedores: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "descripcion") {
        if (!formData[key]?.toString().trim()) {
          newErrors[key] = "Este campo es obligatorio";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) return;

    const idUsuario = parseInt(localStorage.getItem('idUsuario'), 10);

    if (isNaN(idUsuario)) {
      setErrors((prev) => ({ ...prev, general: "Error: Usuario no identificado" }));
      return;
    }

    // Transformar proveedores para solo enviar los IDs
    const formDataProcessed = {
      ...formData,
      idUsuario,
      proveedores: formData.proveedores.map(proveedor => proveedor.value) // Solo los IDs
    };

    try {
      const updatedProducto = await actualizarProductos(producto.id, formDataProcessed);
      if (updatedProducto?.error) {
        setErrors({ general: "Error al actualizar el producto" });
        return;
      }

      Swal.fire("Éxito", "Producto actualizado correctamente.", "success");

      actualizarLista(updatedProducto);

      setTimeout(() => onClose(), 300);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors({ general: "Error al conectar con el servidor" });
    }
  };

  const opcionesGrupos = [...grupos]
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((grupo) => ({ value: grupo.id, label: grupo.nombre }));

  const opcionesUnidad = [...unidad]
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((uni) => ({ value: uni.id, label: uni.nombre }));

  const opcioneProveedor = [...Proveedor]
    .map((prov) => ({ value: prov.id, label: prov.nombre_proveedor }));

  return (
    <>
      <div className="modal-backdrop">
        <div
          className="modal fade show"
          style={{ display: "block" }}
          aria-labelledby="exampleModalLabel"
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ maxWidth: "60vw", marginTop: 90 }}
          >
            <div className="modal-content w-100" style={{ maxWidth: "60vw" }}>
              <div
                className="modal-header"
                style={{ backgroundColor: "#1f618d" }}
              >
                <h5 className="modal-title" style={{ color: "white" }}>
                  Editar Producto
                </h5>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{ padding: "20px", maxHeight: "300vh" }}
              >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Código</label>
                      <input
                        type="text"
                        name="codigo"
                        className={`form-control ${errors.codigo ? "is-invalid" : ""
                          }`}
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
                        className={`form-control ${errors.nombre ? "is-invalid" : ""
                          }`}
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Grupo</label>
                      <Select
                        name="grupo"
                        options={opcionesGrupos}
                        placeholder="SELECCIONA"
                        value={opcionesGrupos.find(
                          (op) => op.value === formData.grupo
                        )}
                        isSearchable={true}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            grupo: selectedOption.value,
                          })
                        }
                        styles={{
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: "200px", // Limita la altura del dropdow
                            overflowY: "auto", // Habilita scroll si hay muchos elementos
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "45px",
                            height: "45px",
                          }),
                        }}
                      />
                      {errors.grupo && (
                        <div className="invalid-feedback">{errors.grupo}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Precio</label>
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{ height: 47 }}
                        >
                          $
                        </span>
                        <input
                          type="number"
                          name="precio"
                          readOnly
                          className={`form-control ${errors.precio ? "is-invalid" : ""
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
                        className={`form-control ${errors.descripcion ? "is-valid" : ""
                          }`}
                        value={formData.descripcion}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Unidad de Medida</label>
                      <Select
                        name="unidad_medida"
                        options={opcionesUnidad}
                        placeholder="SELECCIONA"
                        value={opcionesUnidad.find(
                          (um) => um.value === formData.unidad_medida
                        )}
                        isSearchable={true}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            unidad_medida: selectedOption.value,
                          })
                        }
                        styles={{
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: "200px", // Limita la altura del dropdown
                            overflowY: "auto", // Habilita scroll si hay muchos elementos
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: "45px",
                            height: "45px",
                          }),
                        }}
                      />
                      {errors.unidad_medida && (
                        <div className="invalid-feedback">
                          {errors.unidad_medida}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Proveedor</label>
                      <Select
                        name="proveedores"
                        options={opcioneProveedor}
                        placeholder="SELECCIONA"
                        isMulti
                        classNamePrefix="select"
                        value={formData.proveedores.map(
                          (p) => proveedores.find((prov) => prov.value === p) // Buscamos el objeto proveedor correspondiente
                        )}
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
                        <div className="text-danger small">
                          {errors.proveedores}
                        </div>
                      )}
                    </div>
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
                </div>

                {/* Botones */}
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
                    style={{
                      backgroundColor: "#7f8c8d",
                      color: "white",
                      marginLeft: 7,
                    }}
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
    </>
  );
};