import Swal from 'sweetalert2';

// * variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerInventario = async () => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_inventario`, {
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
    console.log("Datos enviados al backend desde api:", JSON.stringify(inventarioData, null, 2));
    try {
        const response = await fetch(`${API_URL}/entrada/agregar_inventario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inventarioData),
        });
        
        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('No se pudo parsear la respuesta JSON:', error);
            data = { message: 'Respuesta inválida del servidor' };
        }
        
        if (response.ok) {
            Swal.fire('Éxito', 'Inventario agregado correctamente.', 'success');
            return data;
        } else {
            console.error('Error en la respuesta del backend:', data);
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
        const response = await fetch(`${API_URL}/entrada/actualizar_inventario/${id}`, {
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

        const response = await fetch(`${API_URL}/entrada/eliminar_inventario/${id}`, {
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


// * funcion para obtener los nombres de los que autorizan (autorizaciones)

// export const obtenerAutorizaciones = async () => {
//     try {
//         const response = await fetch(`${API_URL}/entrada/obtener_autorizaciones`, { // <- corregir aquí
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         });
//         if (response.ok) {
//             const data = await response.json();
//             return data;
//         }
//     } catch (error) {
//         console.error('Error al realizar la solicitud', error);
//         Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
//         return null;
//     }
// };

// // * funcion para obtener los nombres de los que autorizan (autorizaciones)

// export const obtenerTipoEntradas = async () => {
//     try {
//         const response = await fetch(`${API_URL}/entrada/obtener_tipo_entradas`, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         });
//         if (response.ok) {
//             const data = await response.json();
//             return data;
//         }
//     } catch (error) {
//         console.error('Error al realizar la solicitud', error);
//         Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
//         return null;
//     }
// };

export const cargarListasEntradas = async () => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_listas`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error al realizar la solicitud', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

export const cargarListasCampos = async () => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_inventario`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error al realizar la solicitud', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

// * funcion para la tabla de movimientos en el almacen
export const cargarListasMovimientos = async () => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_movimientos`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error al realizar la solicitud', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};
