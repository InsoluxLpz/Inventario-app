const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

// Agregar un nuevo registro al inventario
router.post('/agregar_inventario', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);

    const { fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor } = req.body;

    if (!fecha || !cantidad || !costo_unitario || !producto || !tipo || !autorizo || !proveedor) {
        return res.status(400).json({ message: 'Hacen falta parámetros para guardar en la tabla' });
    }

    try {
        const query = `INSERT INTO cat_almacen_productos_prueba (fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor) VALUES (?,?,?,?,?,?,?)`;
        const values = [fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor];

        await db.query(query, values);

        return res.status(200).json('Registro agregado correctamente');
    } catch (error) {
        console.error('Error al agregar el registro:', error);
        return res.status(500).json({ message: 'Error al agregar el registro' });
    }
});

// Obtener todos los registros del inventario
router.get('/obtener_inventario', async (req, res) => {
    try {
        const query = `SELECT * FROM cat_almacen_productos_prueba`;
        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No hay valores que mostrar en la tabla');
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        return res.status(500).json({ message: 'Error al obtener los registros' });
    }
});

// Actualizar un registro del inventario por ID
router.put('/actualizar_inventario/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor } = req.body;

    if (!fecha || !cantidad || !costo_unitario || !producto || !tipo || !autorizo || !proveedor) {
        return res.status(400).json({ message: 'Faltan parámetros en la petición' });
    }

    try {
        const query = `UPDATE cat_almacen_productos_prueba SET fecha = ?, cantidad = ?, costo_unitario = ?, producto = ?, tipo = ?, autorizo = ?, proveedor = ? WHERE id = ?`;
        const values = [fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor, id];

        await db.query(query, values);

        return res.status(200).json('Registro actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        return res.status(500).json({ message: 'Error al actualizar el registro' });
    }
});

// Eliminar un registro del inventario por ID
router.delete('/eliminar_inventario/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID para eliminar el registro' });
    }

    try {
        const query = `DELETE FROM cat_almacen_productos_prueba WHERE id = ?`;
        await db.query(query, [id]);

        return res.status(200).json('Registro eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        return res.status(500).json({ message: 'Error al eliminar el registro' });
    }
});

module.exports = router;
