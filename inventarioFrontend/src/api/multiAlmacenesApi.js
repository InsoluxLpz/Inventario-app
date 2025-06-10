import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener lista de almacenes
export const ObtenerAlmacenes = async () => {
  try {
    const response = await fetch(`${API_URL}/almacenes/obtener_almacenes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    Swal.fire(
      "Error",
      "Hubo un problema al conectar con el servidor.",
      "error"
    );
    return null;
  }
};

// Agregar un nuevo almacén
export const AgregarAlmacen = async (almacenData) => {
  try {
    const response = await fetch(`${API_URL}/almacenes/agregar_almacen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(almacenData),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "Éxito",
        text: "Almacén agregado correctamente.",
        icon: "success",
        timer: 1000, // Se cierra automáticamente después de 5 segundos
        showConfirmButton: false, // Oculta el botón de aceptar
      });
      return data;
    } else {
      Swal.fire(
        "Error",
        data.message || "Hubo un problema al agregar el almacén.",
        "error"
      );
      return {
        error: data.message || "Hubo un problema al agregar el almacén.",
      };
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    Swal.fire(
      "Error",
      "Hubo un problema al conectar con el servidor.",
      "error"
    );
    return null;
  }
};

// Actualizar un almacén existente
export const ActualizarAlmacen = async (id, almacenData) => {
  try {
    const response = await fetch(
      `${API_URL}/almacenes/actualizar_almacen/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(almacenData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "Éxito",
        text: "Almacén Actualizado correctamente.",
        icon: "success",
        timer: 1000, // Se cierra automáticamente después de 5 segundos
        showConfirmButton: false, // Oculta el botón de aceptar
      });
      return data;
    } else {
      Swal.fire(
        "Error",
        data.message || "Hubo un problema al actualizar el almacén.",
        "error"
      );
      return {
        error: data.message || "Hubo un problema al actualizar el almacén.",
      };
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    Swal.fire(
      "Error",
      "Hubo un problema al conectar con el servidor.",
      "error"
    );
    return null;
  }
};
