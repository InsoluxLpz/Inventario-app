const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

// Agregar un nuevo almacén
router.post('/agregar_almacen', async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'Faltan parámetros para guardar en la tabla.' });
    }

    try {
        const checkQuery = 'SELECT * FROM cat_almacenes WHERE nombre = ?';
        const [existingAlmacen] = await db.query(checkQuery, [nombre]);

        if (existingAlmacen.length > 0) {
            return res.status(400).json({ message: 'El almacén con ese nombre ya existe.' });
        }

        const insertQuery = 'INSERT INTO cat_almacenes (nombre) VALUES (?)';
        await db.query(insertQuery, [nombre]);

        const [nuevoAlmacen] = await db.query('SELECT * FROM cat_almacenes WHERE nombre = ?', [nombre]);

        return res.status(200).json(nuevoAlmacen[0]);
    } catch (error) {
        console.error('Error al agregar el almacén:', error);
        return res.status(500).json({ message: 'Error al agregar el almacén.' });
    }
});

// Obtener todos los almacenes
router.get('/obtener_almacenes', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM cat_almacenes');

        if (results.length === 0) {
            return res.status(404).json({ message: 'No existen almacenes en la tabla.' });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener los almacenes:', error);
        return res.status(500).json({ message: 'Error al obtener los almacenes.' });
    }
});

// Actualizar almacén por ID
router.put('/actualizar_almacen/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!id || !nombre) {
        return res.status(400).json({ message: 'Faltan parámetros para actualizar el almacén.' });
    }

    try {
        const updateQuery = 'UPDATE cat_almacenes SET nombre = ? WHERE id = ?';
        await db.query(updateQuery, [nombre, id]);

        const [almacenActualizado] = await db.query('SELECT * FROM cat_almacenes WHERE id = ?', [id]);

        return res.status(200).json(almacenActualizado[0]);
    } catch (error) {
        console.error('Error al actualizar el almacén:', error);
        return res.status(500).json({ message: 'Error al actualizar el almacén.' });
    }
});

router.delete('/eliminar_almacen/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Falta el ID para eliminar el registro' });
    }

    try {
        const query = `DELETE FROM cat_almacenes WHERE id = ?`;
        await db.query(query, [id]);

        return res.status(200).json('Registro eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        return res.status(500).json({ message: 'Error al eliminar el registro' });
    }
});

module.exports = router;
