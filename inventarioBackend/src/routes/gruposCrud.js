const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_grupo', async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(404).json({ message: 'Faltan parametros para guardar en la tabla' });
    }

    try {
        const checkQuery = 'SELECT * FROM cat_grupos WHERE nombre = ?';
        const [existingService] = await db.query(checkQuery, [nombre]);

        if (existingService.length > 0) {
            return res.status(400).json({ message: 'El servicio con ese nombre ya existe' });
        }

        const query = `INSERT INTO cat_grupos (nombre) VALUES (?)`;
        const values = [nombre];

        await db.query(query, values);

        const [nuevoServicio] = await db.query("SELECT * FROM cat_grupos WHERE nombre = ?",
            [nombre]
        )

        return res.status(200).json(nuevoServicio[0]);
    } catch (error) {
        console.error('Error al agregar el servicio:', error);
        return res.status(500).json({ message: 'Error al agregar el servicio' });
    }
});


router.get('/obtener_grupo', async (req, res) => {

    try {
        const query = `SELECT * FROM cat_grupos`;

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No existe ningun servicio en la tabla' })
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

router.put('/actualizar_grupo/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'No se encuentra id en la petición' })
    }
    try {
        // Actualizamos el servicio
        const query = `UPDATE cat_grupos SET nombre = ? WHERE id = ?`;
        const values = [nombre, id];
        await db.query(query, values);

        // Obtener el servicio actualizado
        const [rows] = await db.query('SELECT * FROM cat_grupos WHERE id = ?', [id]);
        const grupoActualizado = rows[0];

        return res.status(200).json(grupoActualizado);  // Enviar el servicio actualizado

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;