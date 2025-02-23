import Swal from 'sweetalert2';

// * variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerInventario = async () => {
    try {
        const response = await fetch(`${API_URL}/inventario/obtener_inventario`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

export const agregarInventario = async (inventarioData) => {
    try {
        const response = await fetch(`${API_URL}/inventario/agregar_inventario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventarioData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Inventario agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al agregar el inventario.', 'error');
            return { error: data.message || 'Hubo un problema al agregar el inventario.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

export const actualizarInventario = async (id, inventarioData) => {
    try {
        const response = await fetch(`${API_URL}/inventario/actualizar_inventario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventarioData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Inventario actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al actualizar el inventario.', 'error');
            return { error: data.message || 'Hubo un problema al actualizar el inventario.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

// * Eliminar un registro del inventario
export const eliminarInventario = async (id, actualizarLista) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro que deseas eliminar el inventario?",
            text: "Esta acción eliminará el producto del inventario.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#f1c40f",
            cancelButtonColor: "#7f8c8d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) {
            return;
        }

        const response = await fetch(`${API_URL}/inventario/eliminar_inventario/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Inventario eliminado correctamente',
                showConfirmButton: true,
            });

            // Actualizar la lista de productos después de eliminar
            actualizarLista(id);
        } else {
            throw new Error('Error al eliminar el inventario');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
    }
};
