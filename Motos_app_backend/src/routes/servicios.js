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
        const checkQuery = 'SELECT * FROM cat_servicios WHERE nombre = ?';
        const [existingService] = await db.query(checkQuery, [nombre]);

        if (existingService.length > 0) {
            return res.status(400).json({ message: 'El servicio con ese nombre ya existe' });
        }

        const query = `INSERT INTO cat_servicios (nombre,descripcion) VALUES (?,?)`;
        const values = [nombre, descripcion];

        await db.query(query, values);

        const [nuevoServicio] = await db.query("SELECT * FROM cat_servicios WHERE nombre = ?",
            [nombre]
        )

        return res.status(200).json(nuevoServicio[0]);
    } catch (error) {
        console.error('Error al agregar el servicio:', error);
        return res.status(500).json({ message: 'Error al agregar el servicio' });
    }
});


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
        // Actualizamos el servicio
        const query = `UPDATE cat_servicios SET nombre = ?, descripcion = ? WHERE id = ?`;
        const values = [nombre, descripcion, id];
        await db.query(query, values);

        // Obtener el servicio actualizado
        const [rows] = await db.query('SELECT * FROM cat_servicios WHERE id = ?', [id]);
        const servicioActualizado = rows[0];

        return res.status(200).json(servicioActualizado);  // Enviar el servicio actualizado

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
    console.log("Datos recibidos en el backend:", req.body);

    const { fecha_inicio, odometro, costo, comentario, moto, idAutorizo, idUsuario, idCancelo, fecha_cancelacion, servicios, productos } = req.body;

    if (!fecha_inicio || !moto || !odometro || !costo || !idUsuario || !idAutorizo) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 🔽 Insertar nuevo servicio si no existe
        const [servicioResult] = await connection.query(
            "INSERT INTO mantenimientos (fecha_inicio, odometro, costo_total, comentario, idMoto, idAutorizo, idUsuario, idCancelo, fecha_cancelacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
            [fecha_inicio, odometro, costo, comentario, moto, idAutorizo, idUsuario, idCancelo, fecha_cancelacion]
        );
        const idServicio = servicioResult.insertId;

        // Insertar en servicio_servicios si hay servicios
        if (servicios && servicios.length > 0) {
            const servicioValues = servicios.map(servicio => [idServicio, servicio]);
            await connection.query(
                "INSERT INTO servicio_mantenimientos (idMantenimiento, idServicio) VALUES ?",
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
                "INSERT INTO mantenimientos_detalles (idMantenimiento, idProducto, cantidad, costo, subtotal) VALUES ?",
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


router.get('/obtener_mantenimientos', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.query);

    let { fecha_inicio, fecha_final, servicio, moto } = req.query;
    const connection = await db.getConnection();
    console.log("moto recibido en backend:", moto);

    try {
        if (!fecha_inicio && !fecha_final && !servicio && !moto) {
            const hoy = new Date();
            const diaSemana = hoy.getDay();
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - diaSemana);

            const finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);

            fecha_inicio = inicioSemana.toISOString().split('T')[0];
            fecha_final = finSemana.toISOString().split('T')[0];
        }

        let query = `
            SELECT 
                m.id AS servicio_id,
                m.fecha_inicio,
                m.idMoto,
                m.idAutorizo,
                m.status,
                m.idCancelo,
                m.fecha_cancelacion,
                mt.id as idMoto,
                mt.inciso AS moto_inciso,
                m.odometro,
                m.costo_total,
                m.comentario,
                m.idUsuario,
                m.fecha_cancelacion,
                u.nombre,
                sm.idServicio AS servicio_aplicado_id,
                cs.nombre AS servicio_aplicado_nombre,
                md.idProducto AS producto_id,
                p.nombre AS producto_nombre,
                md.cantidad,
                md.costo,
                md.subtotal
            FROM mantenimientos m
            LEFT JOIN cat_motocicletas_prueba mt ON m.idMoto = mt.id
            LEFT JOIN servicio_mantenimientos sm ON m.id = sm.idMantenimiento
            LEFT JOIN cat_servicios cs ON sm.idServicio = cs.id
            LEFT JOIN usuarios u ON m.idCancelo = u.idUsuario
            LEFT JOIN mantenimientos_detalles md ON m.id = md.idMantenimiento
            LEFT JOIN productos p ON md.idProducto = p.id
            WHERE 1 = 1
        `;

        const queryParams = [];

        // Agregar condiciones de fecha SOLO si no se está filtrando por servicio
        if (fecha_inicio) {
            query += ` AND m.fecha_inicio >= ?`;
            queryParams.push(fecha_inicio);
        }

        if (fecha_final) {
            query += ` AND m.fecha_inicio <= ?`;
            queryParams.push(fecha_final);
        }
        if (moto) {
            query += ` AND m.idMoto = ?`;
            queryParams.push(moto);
        }

        if (servicio) {
            query += ` AND m.id IN (
                    SELECT idMantenimiento 
                    FROM servicio_mantenimientos 
                    WHERE idServicio = ?
                )`;
            queryParams.push(servicio);
        }

        const [rows] = await connection.query(query, queryParams);

        const serviciosMap = new Map();

        rows.forEach(row => {
            if (!serviciosMap.has(row.servicio_id)) {
                serviciosMap.set(row.servicio_id, {
                    id: row.servicio_id,
                    fecha_inicio: row.fecha_inicio,
                    idMoto: row.idMoto,
                    idAutorizo: row.idAutorizo,
                    status: row.status,
                    moto_inciso: row.moto_inciso,
                    odometro: row.odometro,
                    costo_total: row.costo_total,
                    comentario: row.comentario,
                    idUsuario: row.idUsuario,
                    idCancelo: row.idCancelo,
                    nombre: row.nombre,
                    fecha_cancelacion: row.fecha_cancelacion,
                    servicios: [],
                    productos: []
                });
            }

            const servicio = serviciosMap.get(row.servicio_id);

            if (row.servicio_aplicado_id && !servicio.servicios.some(s => s.id === row.servicio_aplicado_id)) {
                servicio.servicios.push({
                    id: row.servicio_aplicado_id,
                    nombre: row.servicio_aplicado_nombre
                });
            }

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



router.put('/actualizar_mantenimiento/:id', async (req, res) => {
    const { id } = req.params;
    const { servicios } = req.body;

    if (!id || !servicios || !Array.isArray(servicios)) {
        return res.status(400).json({ error: "Faltan datos obligatorios o formato incorrecto" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar si el mantenimiento existe
        const [mantenimiento] = await connection.query(
            "SELECT id FROM mantenimientos WHERE id = ?",
            [id]
        );

        if (mantenimiento.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "El mantenimiento no existe" });
        }

        // Eliminar servicios anteriores del mantenimiento
        await connection.query(
            "DELETE FROM servicio_mantenimientos WHERE idMantenimiento = ?",
            [id]
        );

        // Insertar los nuevos servicios seleccionados
        if (servicios.length > 0) {
            const servicioValues = servicios.map(servicio => [id, servicio]);
            await connection.query(
                "INSERT INTO servicio_mantenimientos (idMantenimiento, idServicio) VALUES ?",
                [servicioValues]
            );
        }

        await connection.commit();
        res.json({ message: "Servicios del mantenimiento actualizados correctamente" });

    } catch (error) {
        await connection.rollback();
        console.error("Error al actualizar servicios del mantenimiento:", error);
        res.status(500).json({ error: "Error al actualizar servicios del mantenimiento" });
    } finally {
        connection.release();
    }
});


router.delete('/cancelar_mantenimiento/:id', async (req, res) => {
    const { id } = req.params;
    const { idUsuario } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ error: 'El idUsuario es obligatorio' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {

        const result = await connection.query(
            `UPDATE mantenimientos 
             SET idCancelo = ?, fecha_cancelacion = CURDATE(), status = 0 
             WHERE id = ?`,
            [idUsuario, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Mantenimiento no encontrado' });
        }

        // Si todo fue exitoso, hacer commit de la transacción
        await connection.commit();

        res.status(200).json({ message: 'Mantenimiento cancelado' });
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await connection.rollback();
        console.error('Error al cancelar mantenimiento:', error);
        res.status(500).json({ error: 'Error al cancelar mantenimiento' });
    } finally {
        // Liberar la conexión
        connection.release();
    }
});

module.exports = router;



