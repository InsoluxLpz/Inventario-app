const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_servicio', async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(404).json({ message: 'Faltan parametros para guardar en la tabla' });
    }

    try {
        const query = `INSERT INTO cat_servicios (nombre,descripcion) VALUES (?,?)`;

        const values = [nombre, descripcion];

        await db.query(query, values);

        return res.status(200).json({ message: 'Entrada agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({ message: 'Error al agregar el producto' });
    }
});

router.get('/obtener_servicios', async (req, res) => {

    try {
        const query = `SELECT * FROM cat_servicios`;

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

router.put('/actualizar_servicio/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'No se encuentra id en la petición' })
    }
    try {
        const query = `UPDATE cat_servicios SET nombre = ?, descripcion = ? WHERE id = ?`
        const values = [nombre, descripcion, id]
        await db.query(query, values);

        return res.status(200).json({ message: 'servicio actualizado correctamente' })

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/eliminar_servicio/:id', async (req, res) => {
    const { id } = req.params

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'No se encontro ningun id' });
    }

    try {
        await db.query('DELETE FROM cat_servicios WHERE id = ?', [id]);

        return res.status(200).json({ ok: true, msg: 'Moto eliminada correctamente' });

    } catch (error) {
        console.error('Error al eliminar la moto:', error);
        return res.status(500).json({ ok: false, msg: 'Error en el servidor al eliminar la moto' });
    }
});

//* <============================== mantenimientos-motos======================================>

router.post('/agregar_mantenimiento', async (req, res) => {
    const { fecha_inicio, vehiculo, odometro, servicio, refacciones_almacen, costo_refacciones, costo_total, comentario, status } = req.body;

    if (!fecha_inicio || !vehiculo || !servicio || !refacciones_almacen || !costo_refacciones || !costo_total) {
        return res.status(404).json({ message: 'Faltan parametros en la consulta' });
    }

    try {
        const query = `INSERT INTO servicio_motos (fecha_inicio, vehiculo, odometro, servicio, refacciones_almacen, costo_refacciones, costo_total, comentario, status) VALUES (?,?,?,?,?,?,?,?,?)`

        const results = [fecha_inicio, vehiculo, odometro, servicio, refacciones_almacen, costo_refacciones, costo_total, comentario, status];

        await db.query(query, results);

        return res.status(200).json({ message: 'servicio de moto agregado correctamente' });

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }

});

router.get('/obtener_mantenimientos', async (req, res) => {

    try {
        const query = `SELECT * FROM servicio_motos`

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json({ message: 'no existe ningun servicio en la tabla' })
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});


router.put('/actualizar_mantenimiento/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_inicio, vehiculo, odometro, servicio, refacciones_almacen, costo_refacciones, costo_total, comentario, status } = req.body;

    if (!id || !fecha_inicio || !vehiculo || !servicio || !refacciones_almacen || !costo_refacciones || !costo_total) {
        return res.status(400).json({ message: 'No se encuentra id en la petición' })
    }

    try {
        const query = `UPDATE servicio_motos SET fecha_inicio = ? vehiculo = ? odometro = ? servicio = ? refacciones_almacen = ? costo_refacciones = ? costo_total = ? comentario = ? status id = ?`

        const values = [fecha_inicio, vehiculo, odometro, servicio, refacciones_almacen, costo_refacciones, costo_total, comentario, status, id]

        await db.query(query, values);

        return res.status(200).json({ message: 'Mantenimiento actualizado correctamente' })

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/eliminar_mantenimiento/:id', async (req, res) => {
    const { id } = req.params

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'No se encontro ningun id' });
    }

    try {
        await db.query('DELETE FROM servicio_motos WHERE id = ?', [id]);

        return res.status(200).json({ ok: true, msg: 'Mantenimiento eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar el mantenimiento:', error);
        return res.status(500).json({ ok: false, msg: 'Error en el servidor al eliminar la moto' });
    }
});

module.exports = router;
