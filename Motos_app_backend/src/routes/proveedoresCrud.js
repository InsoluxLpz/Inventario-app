const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

// * Agregar proveedor
router.post('/agregar_proveedor', async (req, res) => {
    const { nombreProveedor, telefonoContacto, rfc, telefonoEmpresa } = req.body;
    console.log("llego la peticion");

    if (!nombreProveedor) {
        return res.status(400).json({ message: 'El nombre del proveedor es obligatorio' });
    }

    try {
        const query = `INSERT INTO cat_proveedores_prueba (nombreProveedor, telefonoContacto, rfc, telefonoEmpresa) VALUES (?, ?, ?, ?)`;

        const values = [nombreProveedor, telefonoContacto, rfc, telefonoEmpresa];

        await db.query(query, values);

        return res.status(200).json({ message: 'Proveedor agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar el proveedor:', error);
        return res.status(500).json({ message: 'Error al agregar el proveedor' });
    }
});

// * Obtener proveedores
router.get('/obtener_proveedores', async (req, res) => {
    try {
        const query = `SELECT * FROM cat_proveedores_prueba`;
        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No hay proveedores registrados' });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        return res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
});

// * Actualizar proveedor
router.put('/actualizar_proveedor/:id', async (req, res) => {
    const { id } = req.params;
    const { nombreProveedor, telefonoContacto, rfc, telefonoEmpresa } = req.body;

    if (!nombreProveedor) {
        return res.status(400).json({ message: 'El nombre del proveedor es obligatorio' });
    }

    try {
        const query = `UPDATE cat_proveedores_prueba SET nombreProveedor = ?, telefonoContacto = ?, rfc = ?, telefonoEmpresa = ? WHERE id = ?`;

        const values = [nombreProveedor, telefonoContacto, rfc, telefonoEmpresa, id];

        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        return res.status(200).json({ message: 'Proveedor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        return res.status(500).json({ message: 'Error al actualizar el proveedor' });
    }
});

// * actualizar status en la tabla de productos
router.put('/actualizar_status_proveedores/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json('Faltan parametros para actualizar el campo');
    }

    console.log("se hare la actualizacion del status prveedores")

    const query = `UPDATE cat_productos_prueba SET status = 0 WHERE id = ?`

    try {
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json('No hay datos en la tabla');
        }
        return res.status(200).json(results);

    } catch (err) {
        console.error('Error al obtener el crédito:', err);
        return res.status(500).json({ errors: ['Error en el servidor'] });
    }

});

// * Eliminar proveedor
router.delete('/eliminar_proveedor/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM cat_proveedores_prueba WHERE id = ?`;
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        return res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        return res.status(500).json({ message: 'Error al eliminar el proveedor' });
    }
});

module.exports = router;