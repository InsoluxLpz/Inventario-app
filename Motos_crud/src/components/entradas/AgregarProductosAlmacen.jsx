import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavBar } from "../NavBar";
import Select from "react-select";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import {
  cargarListasEntradas,
  agregarInventario,
} from "../../api/almacenProductosApi";
import { useNavigate } from "react-router";

export const AgregarProductosAlmacen = ({ productos }) => {
  const navigate = useNavigate();

  const [listaProveedores, setListaProveedores] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [listaAutorizaciones, setListaAutorizaciones] = useState([]);
  const [listaTipoEntrada, setListaTipoEntrada] = useState([]);
  const [listaTipoMovimiento, setListaTipoMovimiento] = useState([]);
  const [errors, setErrors] = useState({});

  // * guardar en un estado hasta que se manden todos a la db
  const [productosAgregados, setProductosAgregados] = useState([]);

  // * estado del formulario por defecto
  const [formData, setFormData] = useState({
    proveedor: null,
    fecha: "",
    cantidad: "",
    producto: null,
    costo_unitario: "",
    tipo: null,
    autorizo: null,
    tipoMovimiento: null,
  });

  // * funciones
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option ? { value: option.value, label: option.label } : null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // * cargar los datos para seleccionar los campos unificación de peticiones
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const data = await cargarListasEntradas();

        if (data.productos) setListaProductos(data.productos);
        if (data.proveedores) setListaProveedores(data.proveedores);
        if (data.autorizaciones) setListaAutorizaciones(data.autorizaciones);
        if (data.tiposEntrada) setListaTipoEntrada(data.tiposEntrada);
        if (data.tipoMovimiento) setListaTipoMovimiento(data.tipoMovimiento);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    cargarListas();
  }, []);

  // * Función para obtener las opciones de proveedores
  const opcionesProveedores = listaProveedores
    ? listaProveedores.map((prov) => ({
        value: prov.id,
        label: prov.nombre_proveedor,
      }))
    : [];

  // * Función para obtener las opciones de productos
  const opcionesProductos = listaProductos
    ? listaProductos.map((prod) => ({
        value: prod.id,
        label: prod.nombre,
      }))
    : [];

  // * Función para obtener las opciones de autorizaciones
  const opcionesAutorizaciones = listaAutorizaciones
    ? listaAutorizaciones.map((auto) => ({
        value: auto.idAutorizo,
        label: auto.nombre,
      }))
    : [];

  // * Función para obtener las opciones de tipos de entrada
  const opcionesTiposEntrada = listaTipoEntrada
    ? listaTipoEntrada.map((tipo) => ({
        value: tipo.id,
        label: tipo.tipo_entrada,
      }))
    : [];

  // * Función para obtener las opciones de tipos de movimiento
  const opcionesTiposMovimiento = listaTipoMovimiento
    ? listaTipoMovimiento.map((mov) => ({
        value: mov.idMovimiento,
        label: mov.movimiento,
      }))
    : [];

  // * funcion para guardar en un estado los productos antes de enviarlos
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Extraemos tanto los valores como los labels de los objetos select
    const nuevoProducto = {
      proveedor: formData.proveedor
        ? {
            value: formData.proveedor.value,
            label: formData.proveedor.label,
          }
        : null, // Guardamos tanto el ID como el nombre del proveedor
      fecha: formData.fecha,
      cantidad: formData.cantidad,
      producto: formData.producto
        ? {
            value: formData.producto.value,
            label: formData.producto.label,
          }
        : null, // Guardamos tanto el ID como el nombre del producto
      costo_unitario: formData.costo_unitario,
      tipo: formData.tipo
        ? {
            value: formData.tipo.value,
            label: formData.tipo.label,
          }
        : null, // Guardamos tanto el ID como el nombre del tipo de entrada
      autorizo_id: formData.autorizo
        ? {
            value: formData.autorizo.value,
            label: formData.autorizo.label,
          }
        : null, // Guardamos tanto el ID como el nombre de la persona que autorizó
      tipoMovimiento: formData.tipoMovimiento
        ? {
            value: formData.tipoMovimiento.value,
            label: formData.tipoMovimiento.label,
          }
        : null, // Guardamos tanto el ID como el nombre del tipo de movimiento
    };

    console.log("nuevoProducto", nuevoProducto);

    setProductosAgregados((prevProductos) => [...prevProductos, nuevoProducto]);

    // Limpiar el formulario después de agregar un producto
    setFormData({
      proveedor: null,
      fecha: "",
      cantidad: "",
      producto: null,
      costo_unitario: "",
      tipo: null,
      autorizo: null,
      tipoMovimiento: null,
    });

    setErrors({});
  };

  // * funcion para enviar los datos a la tabla
  const handleGuardarTodo = async () => {
    if (productosAgregados.length === 0) {
      alert("No hay productos para guardar");
      return;
    }

    const usuario_id = localStorage.getItem("idUsuario");

    for (let producto of productosAgregados) {
      await agregarInventario({
        ...producto,
        usuario_id,
      });
    }

    alert("Productos guardados correctamente");

    // Limpiar la tabla
    setProductosAgregados([]);
  };

  return (
    <>
      <NavBar />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1f618d",
          color: "white",
          ":hover": { opacity: 0.7 },
          position: "fixed",
          right: 50,
          top: 80,
          borderRadius: "8px",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        // onClick={handleModalAgregar}
        onClick={() => navigate("/almacen/ProductoAlmacenTable")}
      >
        <WarehouseIcon sx={{ fontSize: 24 }} />
        Almacén
      </Button>

      <div className="container mt-4">
        <h2>Agregar Entrada</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <label>Proveedor</label>
              <Select
                options={opcionesProveedores}
                value={formData.proveedor}
                onChange={(opcion) => handleSelectChange("proveedor", opcion)}
              />
            </div>

            <div className="col-md-4">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                className="form-control"
                value={formData.cantidad}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Producto</label>
              <Select
                options={opcionesProductos}
                value={formData.producto}
                onChange={(opcion) => handleSelectChange("producto", opcion)}
              />
            </div>

            <div className="col-md-4">
              <label>Costo Unitario</label>
              <input
                type="number"
                name="costo_unitario"
                className="form-control"
                value={formData.costo_unitario}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label>Tipo de entrada</label>
              <Select
                options={opcionesTiposEntrada}
                value={formData.tipo}
                onChange={(opcion) => handleSelectChange("tipo", opcion)}
              />
            </div>

            <div className="col-md-4">
              <label>Autorizó</label>
              <Select
                options={opcionesAutorizaciones}
                value={formData.autorizo}
                onChange={(opcion) => handleSelectChange("autorizo", opcion)}
              />
            </div>

            <div className="col-md-4">
              <label>Tipo Movimiento</label>
              <Select
                options={opcionesTiposMovimiento}
                value={formData.tipoMovimiento}
                onChange={(opcion) =>
                  handleSelectChange("tipoMovimiento", opcion)
                }
              />
            </div>
          </div>
          <div className="mt-3">
            <Button type="submit" variant="contained" color="primary">
              Agregar
            </Button>
          </div>
        </form>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Producto</th>
            <th>Costo Unitario</th>
            <th>Tipo de Entrada</th>
            <th>Autorizó</th>
            <th>Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {productosAgregados.map((producto, index) => (
            <tr key={`${producto}-${index}`}>
              <td>{producto.proveedor ? producto.proveedor.label : ""}</td>
              <td>{producto.fecha}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.producto ? producto.producto.label : ""}</td>
              <td>{producto.costo_unitario}</td>
              <td>{producto.tipo ? producto.tipo.label : ""}</td>
              <td>{producto.autorizo ? producto.autorizo.label : ""}</td>
              <td>
                {producto.tipoMovimiento ? producto.tipoMovimiento.label : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 d-flex justify-content-end ">
        <Button variant="contained" color="success" onClick={handleGuardarTodo}>
          Guardar
        </Button>
      </div>
    </>
  );
};
