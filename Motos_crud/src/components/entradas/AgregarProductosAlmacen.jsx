import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavBar } from "../NavBar";
import Select from "react-select";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";

import {
  cargarListasEntradas,
  agregarInventario,
} from "../../api/almacenProductosApi";
import { useNavigate } from "react-router";

export const AgregarProductosAlmacen = () => {
  const navigate = useNavigate();

  const [listaProveedores, setListaProveedores] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [listaAutorizaciones, setListaAutorizaciones] = useState([]);
  const [listaTipoEntrada, setListaTipoEntrada] = useState([]);
  const [listaTipoMovimiento, setListaTipoMovimiento] = useState([]);
  const [errors, setErrors] = useState({});
  const [productosAgregados, setProductosAgregados] = useState([]);
  // * filtro producto por proveedores
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // * desactivar el select de movimiento despues de agregar un tiopo de entrada hasta que se guarde
  const [tipoMovimientoBloqueado, setTipoMovimientoBloqueado] = useState(false);
  const [tipoMovimientoFijo, setTipoMovimientoFijo] = useState(null);

  // * filtro para el tipo de entrada con el tipo de movimiento
  const [listaTipoEntradaFiltrada, setListaTipoEntradaFiltrada] = useState([]);

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

  // * peticion a la db
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const data = await cargarListasEntradas();

        if (data.proveedores) {
          setListaProveedores(
            data.proveedores.map((p) => ({
              value: p.id,
              label: p.nombre_proveedor,
            }))
          );
        }
        if (data.productos) {
          setListaProductos(
            data.productos.map((p) => ({
              value: p.id,
              label: p.nombre,
              proveedorId: p.id_proveedor,
            }))
          );
        }
        if (data.autorizaciones) {
          setListaAutorizaciones(
            data.autorizaciones.map((a) => ({
              value: a.idAutorizo,
              label: a.nombre,
            }))
          );
        }
        if (data.tiposEntrada) {
          setListaTipoEntrada(
            data.tiposEntrada.map((t) => ({
              value: t.id,
              label: t.tipo_entrada,
            }))
          );
        }
        if (data.tipoMovimiento) {
          setListaTipoMovimiento(
            data.tipoMovimiento.map((m) => ({
              value: m.idMovimiento,
              label: m.movimiento,
            }))
          );
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    cargarListas();
  }, []);

  // * funciones para los campos sobre los que se escriben
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // * funcion para los campos de seleccion
  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option ? { value: option.value, label: option.label } : null,
    }));

    // * funcion para guardar el tipo de movimiento
    if (name === "tipoMovimiento" && !tipoMovimientoFijo) {
      setTipoMovimientoFijo(option); // Guardar el primer tipo de movimiento seleccionado
    }

    // * funcion para guardar el proveedor seleccionado y mostrar producto en su funcion
    if (name === "proveedor") {
      setProveedorSeleccionado(option); // Guardar proveedor seleccionado
      setFormData((prev) => ({ ...prev, producto: null })); // Limpiar selección de producto
    }
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

  // * guardar los datos en el estado
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const nuevoProducto = {
      proveedor_id: formData.proveedor
        ? { value: formData.proveedor.value, label: formData.proveedor.label }
        : null,
      fecha: formData.fecha,
      cantidad: formData.cantidad,
      producto_id: formData.producto
        ? { value: formData.producto.value, label: formData.producto.label }
        : null,
      costo_unitario: formData.costo_unitario,
      tipo_entrada_id: formData.tipo
        ? { value: formData.tipo.value, label: formData.tipo.label }
        : null,
      autorizo_id: formData.autorizo
        ? { value: formData.autorizo.value, label: formData.autorizo.label }
        : null,
      tipo_movimiento_id: formData.tipoMovimiento
        ? tipoMovimientoFijo
        : {
            value: formData.tipoMovimiento.value,
            label: formData.tipoMovimiento.label,
          },
    };

    setProductosAgregados((prevProductos) => {
      const nuevosProductos = [...prevProductos, nuevoProducto];
      if (nuevosProductos.length > 0) {
        setTipoMovimientoBloqueado(true);
      }
      return nuevosProductos;
    });

    setFormData({
      proveedor: null,
      fecha: "",
      cantidad: "",
      producto: null,
      costo_unitario: "",
      tipo: null,
      autorizo: null,
      tipoMovimiento: tipoMovimientoFijo,
    });

    setErrors({});
  };

  // * mandar datos a insertar
  const handleGuardarTodo = async () => {
    if (productosAgregados.length === 0) {
      return;
    }
    const usuario_id = localStorage.getItem("idUsuario");
    for (let producto of productosAgregados) {
      await agregarInventario({
        ...producto,
        usuario_id,
      });
    }
    setProductosAgregados([]);
    setTipoMovimientoBloqueado(false);
    setTipoMovimientoFijo(null);
  };

  // * efecto para el filtro de productos por proveedores
  useEffect(() => {
    console.log("Proveedor seleccionado:", proveedorSeleccionado);
    console.log("productosFiltrados", listaProductos);
    if (proveedorSeleccionado) {
      const productosFiltrados = listaProductos.filter(
        (producto) => producto.proveedorId === proveedorSeleccionado.value
      );
      console.log("productosFiltrados", productosFiltrados);
      setProductosFiltrados(productosFiltrados);
    } else {
      setProductosFiltrados([]);
    }
  }, [proveedorSeleccionado, listaProductos]);

  // * efecto para el filtro de tipo de entrada por el tipo de movimiento
  useEffect(() => {
    if (formData.tipoMovimiento) {
      const movimientoSeleccionado =
        formData.tipoMovimiento.label.toLowerCase();

      if (movimientoSeleccionado === "entrada") {
        setListaTipoEntradaFiltrada(
          listaTipoEntrada.filter((t) =>
            ["compra", "ajuste", "traspaso"].includes(t.label.toLowerCase())
          )
        );
      } else if (movimientoSeleccionado === "salida") {
        setListaTipoEntradaFiltrada(
          listaTipoEntrada.filter((t) =>
            ["devolucion"].includes(t.label.toLowerCase())
          )
        );
      } else {
        setListaTipoEntradaFiltrada([]); // Si no hay coincidencias, limpiar lista
      }

      // Reiniciar el campo de tipo de entrada cuando cambie el tipo de movimiento
      setFormData((prev) => ({ ...prev, tipo: null }));
    }
  }, [formData.tipoMovimiento, listaTipoEntrada]);

  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "16px", // Espacio entre los botones
          position: "fixed",
          right: 50,
          top: 80,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1f618d",
            color: "white",
            ":hover": { opacity: 0.7 },
            borderRadius: "8px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/almacen/ProductoAlmacenTable")}
        >
          <WarehouseIcon sx={{ fontSize: 24 }} />
          Almacén
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1f618d",
            color: "white",
            ":hover": { opacity: 0.7 },
            borderRadius: "8px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/almacen/MovimientosAlmacenTable")}
        >
          <MoveToInboxIcon sx={{ fontSize: 24 }} />
          Movimientos
        </Button>
      </div>

      <div className="container mt-4">
        <h2>Agregar Entrada</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3">
              <label>Tipo Movimiento</label>
              <Select
                options={listaTipoMovimiento}
                value={formData.tipoMovimiento}
                onChange={(opcion) =>
                  handleSelectChange("tipoMovimiento", opcion)
                }
                isDisabled={tipoMovimientoBloqueado}
              />
              {errors.tipoMovimiento && (
                <div className="text-danger">{errors.tipoMovimiento}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Tipo de entrada</label>
              <Select
                // options={listaTipoEntrada}
                options={listaTipoEntradaFiltrada}
                value={formData.tipo}
                onChange={(opcion) => handleSelectChange("tipo", opcion)}
              />
              {errors.tipo && <div className="text-danger">{errors.tipo}</div>}
            </div>

            {/* proveedores */}
            <div className="col-md-3">
              <label>Proveedor</label>
              <Select
                options={listaProveedores}
                value={formData.proveedor}
                onChange={(opcion) => handleSelectChange("proveedor", opcion)}
              />
              {errors.proveedor && (
                <div className="text-danger">{errors.proveedor}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formData.fecha}
                onChange={handleChange}
              />
              {errors.fecha && (
                <div className="text-danger">{errors.fecha}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Producto</label>
              <Select
                options={productosFiltrados}
                // options={listaProductos}
                value={formData.producto}
                onChange={(opcion) => handleSelectChange("producto", opcion)}
                isDisabled={!proveedorSeleccionado}
              />
              {errors.producto && (
                <div className="text-danger">{errors.producto}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                className="form-control"
                value={formData.cantidad}
                onChange={handleChange}
              />
              {errors.cantidad && (
                <div className="text-danger">{errors.cantidad}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Costo Unitario</label>
              <input
                type="number"
                name="costo_unitario"
                className="form-control"
                value={formData.costo_unitario}
                onChange={handleChange}
              />
              {errors.costo_unitario && (
                <div className="text-danger">{errors.costo_unitario}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Autoriza</label>
              <Select
                options={listaAutorizaciones}
                value={formData.autorizo}
                onChange={(opcion) => handleSelectChange("autorizo", opcion)}
              />
              {errors.autorizo && (
                <div className="text-danger">{errors.autorizo}</div>
              )}
            </div>
          </div>

          <div
            className="mt-5"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button type="submit" variant="contained" color="primary">
              Agregar
            </Button>
          </div>
        </form>
      </div>

      <hr />
      <div className="container mt-4">
        <h3 className="text-center">PRODUCTOS AGREGADOS </h3>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Producto</th>
              <th>C/U</th>
              <th>Tipo Entrada</th>
              <th>Autoriza</th>
              <th>Movimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosAgregados.map((producto, index) => (
              <tr key={`${producto}-${index}`}>
                <td>
                  {producto.proveedor_id ? producto.proveedor_id.label : ""}
                </td>
                <td align="center" sx={{ textAlign: "right" }}>
                  {producto.fecha
                    ? new Date(producto.fecha).toLocaleDateString("es-MX")
                    : "Fecha no disponible"}
                </td>
                <td>{producto.cantidad}</td>
                <td>
                  {producto.producto_id ? producto.producto_id.label : ""}
                </td>
                <td>{producto.costo_unitario}</td>
                <td>
                  {producto.tipo_entrada_id
                    ? producto.tipo_entrada_id.label
                    : ""}
                </td>
                <td>
                  {producto.autorizo_id ? producto.autorizo_id.label : ""}
                </td>
                <td>
                  {producto.tipo_movimiento_id
                    ? producto.tipo_movimiento_id.label
                    : ""}
                </td>
                <td> eliminar editar </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="mt-5"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            onClick={handleGuardarTodo}
            variant="contained"
            color="primary"
            disabled={productosAgregados.length === 0}
          >
            Guardar
          </Button>
        </div>
      </div>
    </>
  );
};
