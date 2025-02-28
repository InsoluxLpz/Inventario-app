const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

// router.post('/agregar_servicios', async (req, res) => {
//     const { nombre, descripcion } = req.body;

//     if (!nombre) {
//         return res.status(404).json({ message: 'Faltan parametros para guardar en la tabla' });
//     }

//     try {
//         const query = `INSERT INTO cat_servicios (nombre,descripcion) VALUES (?,?)`;

//         const values = [nombre, descripcion];

//         await db.query(query, values);

//         return res.status(200).json({ message: 'Entrada agregada correctamente' });
//     } catch (error) {
//         console.error('Error al agregar el producto:', error);
//         return res.status(500).json({ message: 'Error al agregar el producto' });
//     }
// });

router.get('/obtener_servicio', async (req, res) => {

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

router.post('/agregar_servicio', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);

    const { fecha_inicio, moto, odometro, costo, comentario, idUsuario, idCancelo, fecha_cancelacion, servicios, productos } = req.body;

    if (!fecha_inicio || !moto || !odometro || !costo || !idUsuario) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [existingService] = await connection.query(
            "SELECT id FROM servicios WHERE idMoto = ? LIMIT 1",
            [moto]
        );

        if (existingService.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: "Ya existe un servicio registrado para esta moto" });
        }

        // 🔽 Insertar nuevo servicio si no existe
        const [servicioResult] = await connection.query(
            "INSERT INTO servicios (fecha_inicio, idMoto, odometro, costo_total, comentario, idUsuario, idCancelo, fecha_cancelacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [fecha_inicio, moto, odometro, costo, comentario, idUsuario, idCancelo, fecha_cancelacion]
        );
        const idServicio = servicioResult.insertId;

        // Insertar en servicio_servicios si hay servicios
        if (servicios && servicios.length > 0) {
            const servicioValues = servicios.map(servicio => [idServicio, servicio]);
            await connection.query(
                "INSERT INTO servicio_servicios (idServicio, idCatServicios) VALUES ?",
                [servicioValues]
            );
        }

        // Insertar en servicios_detalles si hay productos
        if (productos && productos.length > 0) {
            const productoValues = productos.map(producto => [
                idServicio,
                producto.idProducto,
                producto.cantidad,
                producto.costo,
                producto.subtotal
            ]);

            await connection.query(
                "INSERT INTO servicios_detalles (idServicio, idProducto, cantidad, costo, subtotal) VALUES ?",
                [productoValues]
            );
        }

        await connection.commit();
        res.json({ message: "Servicio agregado correctamente", idServicio });

    } catch (error) {
        await connection.rollback();
        console.error("Error al agregar servicio:", error);
        res.status(500).json({ error: "Error al agregar servicio" });
    } finally {
        connection.release();
    }
});


router.get('/obtener_servicios', async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT 
                s.id AS servicio_id,
                s.fecha_inicio,
                s.idMoto,
                m.inciso AS moto_inciso,
                s.odometro,
                s.costo_total,
                s.comentario,
                s.idUsuario,
                s.idCancelo,
                s.fecha_cancelacion,
                ss.idCatServicios AS servicio_aplicado_id,
                cs.nombre AS servicio_aplicado_nombre,
                sd.idProducto AS producto_id,
                p.nombre AS producto_nombre,
                sd.cantidad,
                sd.costo,
                sd.subtotal
            FROM servicios s
            JOIN cat_motocicletas_prueba m ON s.idMoto = m.id
            LEFT JOIN servicio_servicios ss ON s.id = ss.idServicio
            LEFT JOIN cat_servicios cs ON ss.idCatServicios = cs.id
            LEFT JOIN servicios_detalles sd ON s.id = sd.idServicio
            LEFT JOIN productos p ON sd.idProducto = p.id
        `);

        // Agrupar datos por servicio
        const serviciosMap = new Map();

        rows.forEach(row => {
            if (!serviciosMap.has(row.servicio_id)) {
                serviciosMap.set(row.servicio_id, {
                    id: row.servicio_id,
                    fecha_inicio: row.fecha_inicio,
                    idMoto: row.idMoto,
                    moto_inciso: row.moto_inciso,
                    odometro: row.odometro,
                    costo_total: row.costo_total,
                    comentario: row.comentario,
                    idUsuario: row.idUsuario,
                    idCancelo: row.idCancelo,
                    fecha_cancelacion: row.fecha_cancelacion,
                    servicios: [],
                    productos: []
                });
            }

            const servicio = serviciosMap.get(row.servicio_id);

            // Agregar los servicios aplicados sin duplicados
            if (row.servicio_aplicado_id && !servicio.servicios.some(s => s.id === row.servicio_aplicado_id)) {
                servicio.servicios.push({
                    id: row.servicio_aplicado_id,
                    nombre: row.servicio_aplicado_nombre
                });
            }

            // Agregar los productos sin duplicados
            if (row.producto_id && !servicio.productos.some(p => p.id === row.producto_id)) {
                servicio.productos.push({
                    id: row.producto_id,
                    nombre: row.producto_nombre,
                    cantidad: row.cantidad,
                    costo: row.costo,
                    subtotal: row.subtotal
                });
            }
        });

        res.json(Array.from(serviciosMap.values()));

    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).json({ error: "Error al obtener servicios" });
    } finally {
        connection.release();
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
