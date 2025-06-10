import React, { useState, useEffect, useRef } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { AgregarAlmacen } from "../../api/multiAlmacenesApi"; // Tu función API

// * estilo para pasar de pagina a pagina
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

export const AgregarAlmacenesModal = ({
  modalOpen,
  onClose,
  agregarAlmacenLista,
}) => {
  const [nombre, setNombre] = useState("");
  const inputRef = useRef(null); // Mueve esto dentro del componente
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
    
    // * validaciones
    const handleSubmit = async () => {
    if (!nombre.trim()) {
        alert("El nombre es obligatorio.");
        return;
    }
    // * peticion
    const nuevo = await AgregarAlmacen({ nombre });
    if (nuevo) {
      agregarAlmacenLista(nuevo);
      onClose();
      setNombre("");
    } else {
      alert("Error al crear el almacén.");
    }
  };

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Agregar Almacén
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
              event.preventDefault(); // Evita el comportamiento predeterminado
              handleSubmit(); // Guarda automáticamente
            }
          }}
        />
        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
