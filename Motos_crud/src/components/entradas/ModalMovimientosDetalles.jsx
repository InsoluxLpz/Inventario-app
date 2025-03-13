// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { cargarListasMovimientosDetalles } from "../../api/almacenProductosApi"; // Importar API correctamente

// export const ModalMovimientosDetalles = ({ open, onClose, idMovimiento }) => {
//   const [detalleMovimiento, setDetalleMovimiento] = useState([]);

//   useEffect(() => {
//     if (open && idMovimiento) {
//       fetchDetallesMovimiento();
//     }
//   }, [open, idMovimiento]);

//   const fetchDetallesMovimiento = async () => {
//     try {
//       const data = await cargarListasMovimientosDetalles(idMovimiento); // Llamada a la API con el ID correcto
//       console.log("idMovimiento", idMovimiento);
//       setDetalleMovimiento(data);
//     } catch (error) {
//       console.error("Error al obtener detalles del movimiento:", error);
//     }
//   };

//   // Función para el formato de dinero
//   const formatearDinero = (valor) => {
//     return new Intl.NumberFormat("es-MX", {
//       style: "currency",
//       currency: "MXN",
//     }).format(valor);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       sx={{ border: "2px solid black" }}
//     >
//       <DialogTitle>Detalles del Movimiento #{idMovimiento}</DialogTitle>
//       <DialogContent dividers>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableBody>
//               {detalleMovimiento.length > 0 ? (
//                 detalleMovimiento.map((detalle, index) => (
//                   <React.Fragment key={index}>
//                     <TableRow>
//                       <TableCell><strong>Fecha</strong></TableCell>
//                       <TableCell>{detalle.fecha ? new Date(detalle.fecha).toLocaleDateString("es-MX") : "Fecha no disponible"}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Realizó movimiento</strong></TableCell>
//                       <TableCell>{detalle.usuario}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Numero de movimiento</strong></TableCell>
//                       <TableCell>{detalle.movimiento_id}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Tipo de movimiento</strong></TableCell>
//                       <TableCell>{detalle.tipo_movimiento}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Metodo</strong></TableCell>
//                       <TableCell>{detalle.tipo_entrada}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Autorizó</strong></TableCell>
//                       <TableCell>{detalle.autorizado_por}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Producto</strong></TableCell>
//                       <TableCell>{detalle.producto}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Proveedor</strong></TableCell>
//                       <TableCell>{detalle.proveedor}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Cantidad</strong></TableCell>
//                       <TableCell>{detalle.cantidad}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Costo unitario</strong></TableCell>
//                       <TableCell>{formatearDinero(detalle.costo_unitario)}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell><strong>Subtotal</strong></TableCell>
//                       <TableCell>{formatearDinero(detalle.subtotal)}</TableCell>
//                     </TableRow>
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={2} align="center">No hay detalles disponibles.</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary" variant="contained">Cerrar</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };




import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { cargarListasMovimientosDetalles } from "../../api/almacenProductosApi"; // Importar API correctamente

export const ModalMovimientosDetalles = ({ open, onClose, idMovimiento }) => {
  const [detalleMovimiento, setDetalleMovimiento] = useState([]);
  const [movimientoInfo, setMovimientoInfo] = useState(null);

  useEffect(() => {
    if (open && idMovimiento) {
      fetchDetallesMovimiento();
    }
  }, [open, idMovimiento]);

  const fetchDetallesMovimiento = async () => {
    try {
      const data = await cargarListasMovimientosDetalles(idMovimiento);
      console.log("idMovimiento", idMovimiento);
      
      // Separar los detalles del movimiento y los datos generales
      const movimientoData = data.length > 0 ? data[0] : null;
      const detalles = data.length > 0 ? data : [];
      
      setMovimientoInfo(movimientoData);
      setDetalleMovimiento(detalles);
    } catch (error) {
      console.error("Error al obtener detalles del movimiento:", error);
    }
  };

  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ border: "2px solid black" }}
    >
      <DialogTitle>Detalles del Movimiento #{idMovimiento}</DialogTitle>
      <DialogContent dividers>
        {movimientoInfo && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell>{new Date(movimientoInfo.fecha).toLocaleDateString("es-MX")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Realizó movimiento</strong></TableCell>
                    <TableCell>{movimientoInfo.usuario}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Numero de movimiento</strong></TableCell>
                    <TableCell>{movimientoInfo.movimiento_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Tipo de movimiento</strong></TableCell>
                    <TableCell>{movimientoInfo.tipo_movimiento}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Metodo</strong></TableCell>
                    <TableCell>{movimientoInfo.tipo_entrada}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Autorizó</strong></TableCell>
                    <TableCell>{movimientoInfo.autorizado_por}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell>{formatearDinero(movimientoInfo.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Detalles del producto */}
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Producto</strong></TableCell>
                    <TableCell><strong>Cantidad</strong></TableCell>
                    <TableCell><strong>Costo unitario</strong></TableCell>
                    <TableCell><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detalleMovimiento.length > 0 ? (
                    detalleMovimiento.map((detalle, index) => (
                      <TableRow key={`producto-${index}`}>
                        <TableCell>{detalle.producto}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>{formatearDinero(detalle.costo_unitario)}</TableCell>
                        <TableCell>{formatearDinero(detalle.subtotal)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay detalles disponibles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
