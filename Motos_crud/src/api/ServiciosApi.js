
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export const ObtenerServicios = async () => {
    try {
        const response = await fetch(`${API_URL}/servicios/obtener_servicio`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json()
            return data;
        }

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }

};

export const AgregarServicio = async (servicioData) => {
    try {

        const response = await fetch(`${API_URL}/servicios/agregar_servicio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(servicioData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Servicio agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al agregar el servicio.', 'error');
            return { error: data.message || 'Hubo un problema al agregar el servicio.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

export const ActualizarServicio = async (id, servicioData) => {
    try {
        const response = await fetch(`${API_URL}/servicios/actualizar_servicio/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicioData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Datos actualizados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al agregar la moto.', 'error');
            return { error: data.message || 'Hubo un problema al agregar la moto.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};


export const EliminarServicio = async (id, actualizarLista) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro de eliminar esta moto?",
            text: "Esta acción no se puede deshacer.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#f1c40f",
            cancelButtonColor: "#7f8c8d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) {
            return;
        }

        const response = await fetch(`http://192.168.0.104:4000/servicios/eliminar_servicio/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Moto eliminada correctamente',
                showConfirmButton: true,
            });

            // Actualizar la lista de motos después de eliminar
            actualizarLista(id);
        } else {
            throw new Error('Error al eliminar moto');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
    }
};

// *<===================================== SERVICIOS MOTOS ====================================================================>

export const ObtenerMantenimientos = async () => {
    try {
        const response = await fetch(`${API_URL}/servicios/obtener_mantenimientos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json()
            return data;
        }

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }

};

export const AgregarMantenimiento = async (mantenimientoData) => {
    try {

        const response = await fetch(`${API_URL}/servicios/agregar_mantenimiento`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mantenimientoData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Servicio agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al agregar el servicio.', 'error');
            return { error: data.message || 'Hubo un problema al agregar el servicio.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};

export const ActualizarMantenimiento = async (id, MantenimientoData) => {
    try {
        const response = await fetch(`${API_URL}/servicios/actualizar_mantenimiento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(MantenimientoData),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Datos actualizados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            return data;
        } else {
            Swal.fire('Error', data.message || 'Hubo un problema al actualizar el mantenimiento.', 'error');
            return { error: data.message || 'Hubo un problema al actualizar el mantenimiento.' };
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
        return null;
    }
};


export const EliminarMantenimiento = async (id, actualizarLista) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro de cancelar este mantenimiento?",
            text: "El mantenimiento será marcado como cancelado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f1c40f",
            cancelButtonColor: "#7f8c8d",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No"
        });

        if (!result.isConfirmed) {
            return;
        }

        // Obtener el idUsuario desde localStorage
        const idUsuario = localStorage.getItem("idUsuario");
        if (!idUsuario) {
            Swal.fire('Error', 'No se encontró el usuario en la sesión.', 'error');
            return;
        }

        const response = await fetch(`http://192.168.0.104:4000/servicios/cancelar_mantenimiento/${id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario }) // Enviar el ID del usuario que cancela
        });

        if (response.ok) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Mantenimiento cancelado correctamente',
                showConfirmButton: true,
            });

            // Actualizar la lista eliminando el mantenimiento de la vista
            actualizarLista(id);
        } else {
            throw new Error('Error al cancelar mantenimiento');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
    }
};
