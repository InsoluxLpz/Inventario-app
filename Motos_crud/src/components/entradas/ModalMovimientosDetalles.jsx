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

  useEffect(() => {
    if (open && idMovimiento) {
      fetchDetallesMovimiento();
    }
  }, [open, idMovimiento]);

  const fetchDetallesMovimiento = async () => {
    try {
      const data = await cargarListasMovimientosDetalles(idMovimiento); // Llamada a la API con el ID correcto
      console.log("idMovimiento", idMovimiento);
      setDetalleMovimiento(data);
    } catch (error) {
      console.error("Error al obtener detalles del movimiento:", error);
    }
  };

//   * funcion para el formato de dinero
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
      <DialogTitle >Detalles del Movimiento #{idMovimiento}</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {detalleMovimiento.length > 0 ? (
                detalleMovimiento.map((detalle, index) => (
                  <>
                    <TableRow key={`fecha-${index}`}>
                      <TableCell>
                        <strong>Fecha</strong>
                      </TableCell>
                      <TableCell>
                        {detalle.fecha
                          ? new Date(detalle.fecha).toLocaleDateString("es-MX")
                          : "Fecha no disponible"}
                      </TableCell>
                    </TableRow>
                    <TableRow key={`usuario-${index}`}>
                      <TableCell>
                        <strong>Realizo movimiento</strong>
                      </TableCell>
                      <TableCell>{detalle.usuario}</TableCell>
                    </TableRow>
                    <TableRow key={`movimiento-${index}`}>
                      <TableCell>
                        <strong>Numero de movimiento</strong>
                      </TableCell>
                      <TableCell>{detalle.movimiento_id}</TableCell>
                    </TableRow>
                    <TableRow key={`tipo-${index}`}>
                      <TableCell>
                        <strong>Tipo de movimiento</strong>
                      </TableCell>
                      <TableCell>{detalle.tipo_movimiento}</TableCell>
                    </TableRow>
                    <TableRow key={`tipoEntrada-${index}`}>
                      <TableCell>
                        <strong>Metodo</strong>
                      </TableCell>
                      <TableCell>{detalle.tipo_entrada}</TableCell>
                    </TableRow>
                    <TableRow key={`autorizado-${index}`}>
                      <TableCell>
                        <strong>Autorizó</strong>
                      </TableCell>
                      <TableCell>{detalle.autorizado_por}</TableCell>
                    </TableRow>
                    <TableRow key={`producto-${index}`}>
                      <TableCell>
                        <strong>Producto</strong>
                      </TableCell>
                      <TableCell>{detalle.producto}</TableCell>
                    </TableRow>
                    <TableRow key={`proveedor-${index}`}>
                      <TableCell>
                        <strong>Proveedor</strong>
                      </TableCell>
                      <TableCell>{detalle.proveedor}</TableCell>
                    </TableRow>
                    <TableRow key={`cantidad-${index}`}>
                      <TableCell>
                        <strong>Cantidad</strong>
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                    </TableRow>
                    <TableRow key={`costoUnitario-${index}`}>
                      <TableCell>
                        <strong>Costo unitario</strong>
                      </TableCell>
                      <TableCell>{formatearDinero(detalle.costo_unitario)}</TableCell>
                    </TableRow>
                    <TableRow key={`subtotal-${index}`}>
                      <TableCell>
                        <strong>Subtotal</strong>
                      </TableCell>
                      <TableCell>{formatearDinero(detalle.subtotal)}</TableCell>
                    </TableRow>
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay detalles disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
