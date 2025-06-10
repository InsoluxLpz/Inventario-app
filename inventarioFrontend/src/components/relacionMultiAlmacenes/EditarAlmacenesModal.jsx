import React, { useState, useEffect, useRef } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { ActualizarAlmacen } from "../../api/multiAlmacenesApi"; // Asegúrate de que esto esté bien definido

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const EditarAlmacenesModal = ({
  modalOpen,
  onClose,
  almacen,
  actualizarLista,
  listaAlmacenes,
}) => {
  const [nombre, setNombre] = useState("");
  const inputRef = useRef(null); // Mueve esto dentro del componente

  useEffect(() => {
    if (almacen) {
      setNombre(almacen.nombre || "");
    }
  }, [almacen]);

  // * efecto para colocar el cursor en el textfield
  useEffect(() => {
    if (modalOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // Un pequeño delay para esperar al render

      return () => clearTimeout(timer); // Limpiar si el modal se cierra antes
    }
  }, [modalOpen]);

  //   * comprobar si ya existe un almacen con ese nombre
  const handleSubmit = async () => {
    const nombreTrim = nombre.trim();

    if (!nombreTrim) {
      alert("El nombre es obligatorio.");
      return;
    }

    const existeDuplicado = listaAlmacenes.some(
      (a) =>
        a.nombre.toLowerCase() === nombreTrim.toLowerCase() &&
        a.id !== almacen.id
    );

    if (existeDuplicado) {
      alert("Ya existe otro almacén con ese nombre.");
      return;
    }

    try {
      const actualizado = await ActualizarAlmacen(almacen.id, {
        nombre: nombreTrim,
      });

      if (actualizado) {
        actualizarLista(actualizado);
        onClose();
      } else {
        alert("Error al actualizar el almacén.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Ocurrió un error al intentar actualizar.");
    }
  };

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Editar Almacén
        </Typography>
        <TextField
          fullWidth
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="normal"
          inputRef={inputRef}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Actualizar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
