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

//  * consulta para tener los movimientos_almacen_detalle
export const cargarListasMovimientosDetalles = async (idMovimiento) => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_movimientos_detalles/${idMovimiento}`, {
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

//  * consulta para tener los movimientos_almacen_detalle
export const cargarListasMovimientosXProductosDetalles = async (idProducto, fechaInicio, fechaFin) => {
    try {
        const response = await fetch(`${API_URL}/entrada/obtener_movimientosXProductos_detalles/${idProducto}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();

            // Producto existe pero no hay movimientos
            if (data.message && data.data && data.data.length === 0) {
                Swal.fire("Sin movimientos", data.message, "info");
                return [];
            }

            return data;
        } 
        // Producto no encontrado (404)
        else if (response.status === 404) {
            const errorData = await response.json();
            Swal.fire("Producto no encontrado", errorData.message, "warning");
            return [];
        } 
        // Otros errores del servidor
        else {
            const errorData = await response.json();
            Swal.fire("Error", errorData.message || "Hubo un problema con la respuesta del servidor.", "error");
            return [];
        }
    } catch (error) {
        console.error("Error al realizar la solicitud", error);
        Swal.fire("Error", "Hubo un problema al conectar con el servidor.", "error");
        return [];
    }
};

// export const cargarListasMovimientosXProductosDetalles = async (idProducto, fechaInicio, fechaFin) => {
//     try {
//         const response = await fetch(`${API_URL}/entrada/obtener_movimientosXProductos_detalles/${idProducto}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
//             method: "GET",
//             headers: { 'Content-Type': 'application/json' }
//         });

//         if (!data || Object.keys(data).length === 0) {
//             Swal.fire("Producto no encontrado", "El producto especificado no existe.", "warning");
//             return [];
//         }

//         if (response.ok) {
//             return await response.json();
//         } else {
//             Swal.fire( "No hay movimiento de productos en ese rango de fecha", "error");
//         }
//     } catch (error) {
//         console.error("Error al realizar la solicitud", error);
//         Swal.fire("Error", "Hubo un problema al conectar con el servidor.", "error");
//         return null;
//     }
// };


// * consulta para buscar productos por codigo
export const buscarProducto = async (codigo) => {
    try {
        const response = await fetch(`${API_URL}/entrada/buscar_producto/${codigo}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
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
