import { Button, IconButton, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavBar } from "../NavBar";
import Select from "react-select";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import {
  cargarListasEntradas,
  agregarInventario,
} from "../../api/almacenProductosApi";
import { useNavigate } from "react-router";
import { ModalBuscarProductos } from "./ModalBuscarProductos";

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
  // const [productosFiltrados, setProductosFiltrados] = useState([]);
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

  // * desactivar select de Autorizo
  const [autorizoBloqueado, setAutorizoBloqueado] = useState(false);
  const [autorizoFijo, setAutorizoFijo] = useState(null);

  // * estado del modal
  const [openModal, setOpenModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  // * envio del total al backend
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    proveedor: null,
    fecha: "",
    cantidad: "",
    producto: [],
    costo_unitario: "",
    tipo: null,
    autorizo: null,
    tipoMovimiento: null,
  });

  // * funciones para el modal
  const handleOpenModal = (codigo) => {
    setSelectedMovimiento(codigo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMovimiento(null);
  };

  // * funcion para actualizar el estado cuando un usaurio elija un producto desde el modal
  const handleProductoSeleccionado = (producto) => {
    setProductoSeleccionado(producto);
    setFormData((prev) => ({
      ...prev,
      producto: { value: producto.id, label: producto.nombre },
      costo_unitario: producto.precio || "",
    }));
    setOpenModal(false); // Cierra el modal después de seleccionar un producto
  };

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
              costoUnitario: p.precio,
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
              label: t.tipoSubMovimiento,
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

    // * funcion para guardar el Autorizador
    if (name === "autorizo" && !autorizoFijo) {
      setAutorizoFijo(option); // Guardar el primer tipo de entrada seleccionado
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

    // * funcion para cargar el costo_unitario cuando se seleccione el producto
    if (name === "producto" && option) {
      setFormData((prev) => ({
        ...prev,
        producto: option,
        costo_unitario: option.costoUnitario || "", // Llenar costo unitario
      }));
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

  // * <<<<<<<<<---------------- Arreglar aqui -------------------->>>>>>>>>>>>>>>>>
  // * guardar los datos en el estado
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // const nuevoProducto = {
    //   idProveedor: formData.proveedor
    //     ? proveedorFijo
    //     : { value: formData.proveedor.value, label: formData.proveedor.label },
    //   fecha: fechaFijo ?? formData.fecha,
    //   cantidad: formData.cantidad,
    //   idProducto: formData.producto
    //     ? { value: formData.producto.value, label: formData.producto.label }
    //     : null,
    //   costo_unitario: formData.costo_unitario,
    //   idTipoSubmovimiento: formData.tipo
    //     ? tipoEntradaFijo
    //     : {
    //         value: formData.tipo.value,
    //         label: formData.tipo.label,
    //       },
    //   autorizo_id: formData.autorizo
    //     ? autorizoFijo
    //     : { value: formData.autorizo.value, label: formData.autorizo.label },
    //   idTipoMovimiento: formData.tipoMovimiento
    //     ? tipoMovimientoFijo
    //     : {
    //         value: formData.tipoMovimiento.value,
    //         label: formData.tipoMovimiento.label,
    //       },
    // };

    // console.log("nuevoProducto",nuevoProducto)

    const nuevoProducto = {
      fecha: fechaFijo,
      idTipoMovimiento: tipoMovimientoFijo.value,
      idTipoSubmovimiento: tipoEntradaFijo.value,
      idAutorizo: autorizoFijo.value,
      productos: [
        {
          idProducto: formData.producto
            ? { value: formData.producto.value, label: formData.producto.label }
            : null,
          idProveedor: formData.proveedor
            ? proveedorFijo
            : {
                value: formData.proveedor.value,
                label: formData.proveedor.label,
              },
          costo_unitario: formData.costo_unitario,
          cantidad: formData.cantidad,
        },
      ],
    };
    console.log("Nuevo Producto", nuevoProducto);

    setProductosAgregados((prevProductos) => {
      const nuevosProductos = [...prevProductos, nuevoProducto];
      if (nuevosProductos.length > 0) {
        setTipoMovimientoBloqueado(true);
        setTipoEntradaBloqueado(true);
        setProveedorBloqueado(true);
        setFechaBloqueado(true);
        setAutorizoBloqueado(true);
      }
      return nuevosProductos;
    });

    setFormData({
      proveedor: proveedorFijo,
      fecha: fechaFijo,
      cantidad: "",
      producto: [],
      costo_unitario: "",
      tipo: tipoEntradaFijo,
      autorizo: autorizoFijo,
      tipoMovimiento: tipoMovimientoFijo,
    });

    setErrors({});
  };

  // * mandar datos a insertar
  const handleGuardarTodo = async () => {
    if (productosAgregados.length === 0) {
      console.log("Productos Agregados:", productosAgregados); // Asegúrate de que no esté vacío
      return;
    }
    const idUsuario = localStorage.getItem("idUsuario");

    // * esto es lo que se envia al backend
    const datosParaEnviar = {
      fecha: productosAgregados[0].fecha, // Usa la fecha de uno de los productos
      idTipoMovimiento: productosAgregados[0].idTipoMovimiento,
      idTipoSubmovimiento: productosAgregados[0].idTipoSubmovimiento,
      idAutorizo: productosAgregados[0].idAutorizo,
      productos: productosAgregados.flatMap((item) => item.productos), // Flatten para enviar todos los productos en un solo array
      total: total,
      idUsuario,
    };
    // * Llamada a la API para agregar el inventario
    await agregarInventario(datosParaEnviar);

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
    // * autorizo
    setAutorizoBloqueado(false);
    setAutorizoFijo(null);

    // * resetear el estado de todo despues de mandar a guardar los valores
    setFormData({
      proveedor: null,
      fecha: "",
      cantidad: "",
      producto: [],
      costo_unitario: "",
      tipo: null,
      autorizo: null,
      tipoMovimiento: null,
    });
  };

  // * efecto para el filtro de tipo de entrada por el tipo de movimiento
  useEffect(() => {
    if (formData.tipoMovimiento) {
      const movimientoSeleccionado =
        formData.tipoMovimiento.label.toLowerCase();

      let nuevaLista = [];

      if (movimientoSeleccionado === "entrada") {
        nuevaLista = listaTipoEntrada.filter((t) =>
          ["compra", "ajuste"].includes(t.label.toLowerCase())
        );
      } else if (movimientoSeleccionado === "salida") {
        nuevaLista = listaTipoEntrada.filter((t) =>
          ["devolucion", "traspaso"].includes(t.label.toLowerCase())
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
      // * autorizo
      setAutorizoBloqueado(false);
      setAutorizoFijo(null);
    }
  };

  // * efecto para calcular el total y guardarlo en el estado
  useEffect(() => {
    const nuevoTotal = productosAgregados.reduce(
      (total, item) =>
        total +
        (item.productos[0]?.cantidad * item.productos[0]?.costo_unitario || 0),
      0
    );
    setTotal(nuevoTotal);
  }, [productosAgregados]);

  const miniDrawerWidth = 50;

  // * funcion para formato de dinero
  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexdirection: "row",
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
          Inventario
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
        <Box
          sx={{
            backgroundColor: "#1f618d",
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
            marginTop: "70px", // Ajusta el valor de marginTop según lo que necesites
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end", // Esto mantiene el contenido alineado al fondo
            height: "100%", // Asegúrate de que el contenedor tenga suficiente altura
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="white">
            REALIZAR MOVIMIENTO
          </Typography>
        </Box>

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
              <label>Metodo</label>
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
                onFocus={(e) => e.target.showPicker()} // Abre el calendario al hacer clic en el input
                disabled={FechaBloqueado}
              />
              {errors.fecha && (
                <div className="text-danger">{errors.fecha}</div>
              )}
            </div>

            {/* PRODUCTOS */}
            <div className="col-md-3">
              <label>Producto</label>
              <IconButton
                color="primary"
                onClick={handleOpenModal}
                flexdirection={"flex-end"}
                disabled={!proveedorSeleccionado}
              >
                <ContentPasteSearchIcon sx={{ fontSize: 29 }} />
              </IconButton>
              <Select
                options={listaProductos}
                value={formData.producto}
                onChange={(opcion) => handleSelectChange("producto", opcion)}
                isDisabled={!proveedorSeleccionado}
              />
              {errors.producto && (
                <div className="text-danger">{errors.producto}</div>
              )}
            </div>

            <div className="col-md-3" style={{ marginTop: "20px" }}>
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

            <div className="col-md-3" style={{ marginTop: "20px" }}>
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

            <div className="col-md-3" style={{ marginTop: "20px" }}>
              <label>Autoriza</label>
              <Select
                options={listaAutorizaciones}
                value={formData.autorizo}
                onChange={(opcion) => handleSelectChange("autorizo", opcion)}
                isDisabled={autorizoBloqueado}
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

      {/*   LINEA DIVISORA ENTRE AGREGAR Y LOS PRODUCTOS YA AGREGADOS */}
      <hr />

      {/* ESTADO DE PRODUCTOS AGREGADOS */}

      <Box
        sx={{
          backgroundColor: "#f2f3f4",
          minHeight: "100vh",
          paddingBottom: 5,
          transition: "margin 0.3s ease-in-out",
          marginLeft: `${miniDrawerWidth}px`,
        }}
      >
        <div className="container mt-4">
          <Box
            sx={{
              backgroundColor: "#1f618d",
              padding: "10px 20px",
              borderRadius: "8px 8px 0 0",
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="white">
              MOVIMIENTO DE LOS PRODUCTOS
            </Typography>
          </Box>

          <div
            style={{
              maxHeight: "200px", // Ajusta la altura según necesites
              overflowY: "auto", // Activa el scroll vertical
              marginTop: "20px",
            }}
          >
            <table
              className="table"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead style={{ backgroundColor: "#1f618d", color: "white" }}>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Costo unitario</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosAgregados.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9e9e9",
                      borderRadius: "8px",
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <td>{item.productos[0]?.idProducto?.label || "N/A"}</td>
                    <td>{item.productos[0]?.cantidad}</td>
                    <td>{item.productos[0]?.costo_unitario}</td>
                    <td>
                      {formatearDinero(
                        item.productos[0]?.cantidad *
                          item.productos[0]?.costo_unitario
                      )}
                    </td>
                    <td>
                      <IconButton
                        sx={{
                          color: "red",
                          ":hover": { backgroundColor: "#ffdddd" },
                        }}
                        onClick={() => eliminarProductoInventario(index)}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 29 }} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold ">
                    Total:
                  </td>
                  <td>
                    {formatearDinero(
                      productosAgregados.reduce(
                        (total, item) =>
                          total +
                          (item.productos[0]?.cantidad *
                            item.productos[0]?.costo_unitario || 0),
                        0
                      )
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div
            className="mt-5"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleGuardarTodo}
              variant="contained"
              color="primary"
              disabled={productosAgregados.length === 0}
              sx={{
                backgroundColor: "#1f618d",
                color: "white",
                ":hover": { backgroundColor: "#145a8d" },
              }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => window.location.reload()}
              disabled={productosAgregados.length === 0}
              sx={{
                borderColor: "#1f618d",
                color: "#1f618d",
                ":hover": { borderColor: "#145a8d", color: "#145a8d" },
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Box>

      <ModalBuscarProductos
        open={openModal}
        onClose={handleCloseModal}
        onSelect={handleProductoSeleccionado}
        productos={listaProductos}
      />
    </>
  );
};
