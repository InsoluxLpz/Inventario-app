import { Button, IconButton, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavBar } from "../NavBar";
import Select from "react-select";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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

  // * filtro para el tipo de entrada con el tipo de movimiento
  const [listaTipoEntradaFiltrada, setListaTipoEntradaFiltrada] = useState([]);

  // * desactivar el select de movimiento despues de agregar un tiopo de entrada hasta que se guarde
  const [tipoMovimientoBloqueado, setTipoMovimientoBloqueado] = useState(false);
  const [tipoMovimientoFijo, setTipoMovimientoFijo] = useState(null);

  // * desactivar select de tipo de entrada
  const [tipoEntradaBloqueado, setTipoEntradaBloqueado] = useState(false);
  const [tipoEntradaFijo, setTipoEntradaFijo] = useState(null);

  // * desactivar select de Proveedor
  const [proveedorBloqueado, setProveedorBloqueado] = useState(false);
  const [proveedorFijo, setProveedorFijo] = useState(null);

  // * desactivar select de Fecha
  const [FechaBloqueado, setFechaBloqueado] = useState(false);
  const [fechaFijo, setFechaFijo] = useState(null);

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

    // Si el campo cambiado es "fecha", actualizamos fechaFijo también
    if (name === "fecha") {
      setFechaFijo(value);
    }
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
    // * funcion para guardar el tipo de Entrada
    if (name === "tipo" && !tipoEntradaFijo) {
      setTipoEntradaFijo(option); // Guardar el primer tipo de entrada seleccionado
    }

    // * funcion para guardar el proveedor
    if (name === "proveedor" && !proveedorFijo) {
      setProveedorFijo(option); // Guardar el primer tipo de entrada seleccionado
    }

    // * funcion para guardar la fecha
    if (name === "fecha") {
      setFechaFijo(value); // Guarda la fecha siempre que se seleccione
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
        ? proveedorFijo
        : { value: formData.proveedor.value, label: formData.proveedor.label },
      fecha: fechaFijo ?? formData.fecha,
      cantidad: formData.cantidad,
      producto_id: formData.producto
        ? { value: formData.producto.value, label: formData.producto.label }
        : null,
      costo_unitario: formData.costo_unitario,
      tipo_entrada_id: formData.tipo
        ? tipoEntradaFijo
        : {
            value: formData.tipo.value,
            label: formData.tipo.label,
          },
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
        setTipoEntradaBloqueado(true);
        setProveedorBloqueado(true);
        setFechaBloqueado(true);
      }
      return nuevosProductos;
    });

    setFormData({
      proveedor: proveedorFijo,
      fecha: fechaFijo,
      cantidad: "",
      producto: null,
      costo_unitario: "",
      tipo: tipoEntradaFijo,
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
    // * reset formualrio
    setProductosAgregados([]);
    // * tipo de movimientos
    setTipoMovimientoBloqueado(false);
    setTipoMovimientoFijo(null);
    // * tipo de entrada
    setTipoEntradaBloqueado(false);
    setTipoEntradaFijo(null);
    // * proveedor
    setProveedorBloqueado(false);
    setProveedorFijo(null);
    // * fecha
    setFechaBloqueado(false);
    setFechaFijo(null);
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

      let nuevaLista = [];

      if (movimientoSeleccionado === "entrada") {
        nuevaLista = listaTipoEntrada.filter((t) =>
          ["compra", "ajuste", "traspaso"].includes(t.label.toLowerCase())
        );
      } else if (movimientoSeleccionado === "salida") {
        nuevaLista = listaTipoEntrada.filter((t) =>
          ["devolucion"].includes(t.label.toLowerCase())
        );
      }

      setListaTipoEntradaFiltrada(nuevaLista);

      // Verificar si el tipo actual sigue en la lista filtrada
      const tipoActualValido = nuevaLista.some(
        (t) => t.label === formData.tipo?.label
      );

      if (!tipoActualValido) {
        setFormData((prev) => ({ ...prev, tipo: null }));
      }
    }
  }, [formData.tipoMovimiento, listaTipoEntrada]);

  // * funcion para limpiar el inventario
  const eliminarProductoInventario = (index) => {
    setProductosAgregados((prevProductos) =>
      prevProductos.filter((_, i) => i !== index)
    );

    // Si ya no hay productos, desbloquea la selección de tipo de movimiento
    if (productosAgregados.length === 1) {
      // * tipo de movimiento
      setTipoMovimientoBloqueado(false);
      setTipoMovimientoFijo(null);
      // * tipo de entrada
      setTipoEntradaBloqueado(false);
      setTipoEntradaFijo(null);
      // * proveedor
      setProveedorBloqueado(false);
      setProveedorFijo(null);
      // * fecha
      setFechaBloqueado(false);
      setFechaFijo(null);
    }
  };

  const miniDrawerWidth = 50;

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
            {/* TIPO DE MOVIMIENTO */}
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

            {/* TIPO DE ENTRADA */}
            <div className="col-md-3">
              <label>Tipo de entrada</label>
              <Select
                options={listaTipoEntradaFiltrada}
                value={formData.tipo}
                onChange={(opcion) => handleSelectChange("tipo", opcion)}
                isDisabled={tipoEntradaBloqueado}
              />
              {errors.tipo && <div className="text-danger">{errors.tipo}</div>}
            </div>

            {/* PROVEEDORES */}
            <div className="col-md-3">
              <label>Proveedor</label>
              <Select
                options={listaProveedores}
                value={formData.proveedor}
                onChange={(opcion) => handleSelectChange("proveedor", opcion)}
                isDisabled={proveedorBloqueado}
              />
              {errors.proveedor && (
                <div className="text-danger">{errors.proveedor}</div>
              )}
            </div>
            {/* FECHA */}
            <div className="col-md-3">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formData.fecha}
                onChange={handleChange}
                disabled={FechaBloqueado}
              />
              {errors.fecha && (
                <div className="text-danger">{errors.fecha}</div>
              )}
            </div>

            <div className="col-md-3">
              <label>Producto</label>
              <Select
                options={productosFiltrados}
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
      <Box
        sx={{
          backgroundColor: "#f2f3f4",
          minHeight: "100vh",
          paddingBottom: 4,
          transition: "margin 0.3s ease-in-out",
          marginLeft: `${miniDrawerWidth}px`,
        }}
      >
        {/* <Box width="90%" maxWidth={2000} margin="0 auto" mt={4}></Box> */}
        <div className="container mt-4">
          <h3 className="text-center">PRODUCTOS AGREGADOS</h3>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Costo unitario</th>
                {/* <th>Tipo Entrada</th>
              <th>Autoriza</th>
              <th>Movimiento</th> */}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosAgregados.map((producto, index) => (
                <tr key={`${producto}-${index}`}>
                  <td>
                    {producto.proveedor_id ? producto.proveedor_id.label : ""}
                  </td>
                  <td>
                    {producto.producto_id ? producto.producto_id.label : ""}
                  </td>
                  <td>{producto.cantidad}</td>
                  <td>
                    {producto.fecha
                      ? new Date(producto.fecha).toLocaleDateString("es-MX")
                      : "Fecha no disponible"}
                  </td>
                  <td>{producto.costo_unitario}</td>
                  <td>
                    {/* Botón para eliminar el producto agregado en el estado */}
                    <IconButton
                      sx={{ color: "black" }}
                      onClick={() => eliminarProductoInventario(index)} // Pasar el índice del producto a eliminar
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 29 }} />
                    </IconButton>
                  </td>
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
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
};
