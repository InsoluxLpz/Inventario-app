const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_inventario', async (req, res) => {
    const {
        fecha,
        idTipoMovimiento,
        idTipoSubmovimiento,
        idAutorizo,
        productos,
        idUsuario,
        total,
        idAlmacenOrigen,
        idAlmacenDestino,
    } = req.body;

    console.log('Datos recibidos:', {
        fecha,
        idTipoMovimiento,
        idTipoSubmovimiento,
        idAutorizo,
        productos,
        idUsuario,
        total,
        idAlmacenOrigen,
        idAlmacenDestino
    });

    if (!fecha || !productos || productos.length === 0 ||
        !idTipoMovimiento || !idTipoSubmovimiento || !idAutorizo || !idUsuario) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Validaciones por tipo de movimiento
    if (idTipoMovimiento === 1) {
        // Entrada
        if (!idAlmacenDestino) {
            return res.status(400).json({ message: 'El almacén destino es obligatorio para entradas' });
        }
    } else if (idTipoMovimiento === 2) {
        // Salida
        if (idTipoSubmovimiento === 3) {
            // Traspaso
            if (!idAlmacenOrigen || !idAlmacenDestino) {
                return res.status(400).json({ message: 'El traspaso requiere almacén origen y destino' });
            }
        } else {
            // Salida normal
            if (!idAlmacenOrigen) {
                return res.status(400).json({ message: 'El almacén origen es obligatorio para salidas' });
            }
        }
    }

    let connection;
    try {
        connection = await db.getConnection();

        // 🔍 Validar stock si es traspaso
        if (idTipoMovimiento === 2 && idTipoSubmovimiento === 3) {
            for (let producto of productos) {
                const idProducto = producto.idProducto?.value || producto.idProducto;
                const cantidadSolicitada = Number(producto.cantidad);

                const [stockResult] = await connection.query(
                    `SELECT cantidad FROM inventario_almacen 
                     WHERE idProducto = ? AND idAlmacen = ?`,
                    [idProducto, idAlmacenOrigen]
                );

                const cantidadDisponible = stockResult.length > 0 ? stockResult[0].cantidad : 0;

                if (cantidadDisponible < cantidadSolicitada) {
                    return res.status(400).json({
                        message: `Stock insuficiente en el almacén.`,
                        detalle: {
                            idProducto,
                            cantidadDisponible,
                            cantidadSolicitada
                        }
                    });
                }
            }
        }

        await connection.beginTransaction();

        const queryMaestro = `
            INSERT INTO movimientos_almacen
            (fecha, idTipoMovimiento, idTipoSubmovimiento, idAutorizo, idUsuario, total, idAlmacenOrigen, idAlmacenDestino)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await connection.query(queryMaestro, [
            fecha,
            idTipoMovimiento,
            idTipoSubmovimiento,
            idAutorizo,
            idUsuario,
            total,
            idAlmacenOrigen,
            idAlmacenDestino,
        ]);

        const idMovimiento = result.insertId;

        const queryDetalle = `
            INSERT INTO movimientos_almacen_detalle
            (idMovimiento, idProducto, idProveedor, cantidad, costo_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)`;

        for (let producto of productos) {
            const idProducto = producto.idProducto?.value || producto.idProducto;
            const idProveedor = producto.idProveedor?.value || null;
            const cantidad = Number(producto.cantidad);
            const costo_unitario = Number(producto.costo_unitario);
            const subtotal = cantidad * costo_unitario;

            await connection.query(queryDetalle, [
                idMovimiento,
                idProducto,
                idProveedor,
                cantidad,
                costo_unitario,
                subtotal
            ]);
        }

        await connection.commit();
        res.status(201).json({ message: "Productos agregados correctamente", idMovimiento });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al insertar el movimiento:", error);
        res.status(500).json({ message: "Error al insertar el movimiento", error });
    } finally {
        if (connection) connection.release();
    }
});


// Actualizar un registro del inventario por ID
router.put('/actualizar_inventario/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor, idAlmacenOrigen, idAlmacenDestino } = req.body;

    if (!fecha || !cantidad || !costo_unitario || !producto || !tipo || !autorizo || !proveedor || !idAlmacenDestino) {
        return res.status(400).json({ message: 'Faltan parámetros en la petición' });
    }

    try {
        const query = `UPDATE movimientos_almacen SET fecha = ?, cantidad = ?, costo_unitario = ?, producto = ?, tipo = ?, autorizo = ?, proveedor = ? idAlmacenOrigen = ?, idAlmacenDestino = ? WHERE id = ?`;
        const values = [fecha, cantidad, costo_unitario, producto, tipo, autorizo, proveedor, idAlmacenOrigen, idAlmacenDestino, id];

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
        const query = `DELETE FROM movimientos_almacen WHERE id = ?`;
        await db.query(query, [id]);

        return res.status(200).json('Registro eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        return res.status(500).json({ message: 'Error al eliminar el registro' });
    }
});

// * peticion unificada para cargar listas
router.get('/obtener_listas', async (req, res) => {
    try {
        const [proveedores] = await db.query("SELECT id, nombre_empresa FROM proveedores");
        const [productos] = await db.query(`SELECT * from productos`);
        const [autorizaciones] = await db.query("SELECT idAutorizo, nombre FROM cat_autorizaciones");
        const [tiposEntrada] = await db.query("SELECT id, tipoSubMovimiento FROM cat_sub_movimientos");
        const [tipoMovimiento] = await db.query("SELECT idMovimiento, movimiento FROM cat_tipo_movimiento");
        const [listaAlmacenes] = await db.query("SELECT * FROM cat_almacenes");

        res.status(200).json({
            proveedores,
            productos,
            autorizaciones,
            tiposEntrada,
            tipoMovimiento,
            listaAlmacenes
        });
    } catch (error) {
        console.error("Error al obtener listas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }

});

// * consulta buena falta la autorizacion
router.get('/obtener_inventario', async (req, res) => {
    const { idAlmacen } = req.query;

    let query = `
    SELECT 
      p.nombre as nombreProducto,
      p.idGrupo as idGrupo,
      cp.nombre as nombreGrupo,
      cum.id as idUnidadMedida,
      cum.nombre as unidadMedida,
      p.precio as costoUnitario,
      ia.cantidad as cantidad,
      ia.idAlmacen as idAlmacen,
      alm.nombre AS nombre_inventario,
      p.codigo
    FROM productos p
    LEFT JOIN inventario_almacen ia ON p.id = ia.idProducto
    LEFT JOIN cat_almacenes alm ON ia.idAlmacen = alm.id
    LEFT JOIN cat_grupos cp ON cp.id = p.idGrupo
    LEFT JOIN cat_unidad_medida cum ON p.idUnidadMedida = cum.id
    WHERE p.status = 1
  `;

    if (idAlmacen) {
        query += ` AND ia.idAlmacen = ?`;
    }

    try {
        const [result] = await db.query(query, idAlmacen ? [idAlmacen] : []);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// * consulta que se puede pedir mas adelante para la tabla movimientos almacen
router.get('/obtener_movimientos', async (req, res) => {
    const {
        fechaInicio,
        fechaFin,
        page = 1,
        limit = 50,
        tipoMovimiento,
        subMovimiento,
        idAlmacen,
    } = req.query;

    const offset = (page - 1) * limit;
    console.log("page:", page, "limit:", limit, "offset:", offset, "tipoMovimiento", tipoMovimiento, "subMovimiento", subMovimiento, "idAlmacen:", idAlmacen);

    try {
        let query = `
            SELECT 
                ma.id AS idMovimiento,
                ma.fecha AS fecha_movimiento,
                u.nombre AS nombreUsuario,
                a.nombre AS nombreAutorizo,
                tm.idMovimiento AS idTipoMovimiento,
                tm.movimiento AS tipoMovimiento,
                sm.id AS idSubMovimiento,
                sm.tipoSubMovimiento AS subMovimiento,
                GROUP_CONCAT(
                    CONCAT(mad.idProducto, ' - ', mad.cantidad, ' - ', mad.costo_unitario, ' - ', mad.subtotal) 
                    SEPARATOR ', '
                ) AS detalles
            FROM movimientos_almacen ma
            LEFT JOIN movimientos_almacen_detalle mad 
                ON ma.id = mad.idMovimiento
            LEFT JOIN cat_autorizaciones a 
                ON ma.idAutorizo = a.idAutorizo
            LEFT JOIN usuarios u 
                ON u.idUsuario = ma.idUsuario
            LEFT JOIN cat_tipo_movimiento tm 
                ON ma.idTipoMovimiento = tm.idMovimiento
            LEFT JOIN cat_sub_movimientos sm 
                ON ma.idTipoSubmovimiento = sm.id
        `;

        const queryParams = [];
        let whereConditions = [];

        // Filtro por fecha
        if (fechaInicio && fechaFin) {
            const fechaInicioCompleta = `${fechaInicio} 00:00:00`;
            const fechaFinCompleta = `${fechaFin} 23:59:59`;
            whereConditions.push("ma.fecha BETWEEN ? AND ?");
            queryParams.push(fechaInicioCompleta, fechaFinCompleta);
        }

        // Filtro por tipoMovimiento
        if (tipoMovimiento) {
            whereConditions.push("tm.idMovimiento = ?");
            queryParams.push(tipoMovimiento);
        }

        // Filtro por subMovimiento
        if (subMovimiento) {
            whereConditions.push("sm.id = ?");
            queryParams.push(subMovimiento);
        }

        // Filtro por almacén (origen o destino)
        if (idAlmacen) {
            whereConditions.push("(ma.idAlmacenOrigen = ? OR ma.idAlmacenDestino = ?)");
            queryParams.push(idAlmacen, idAlmacen);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        query += " GROUP BY ma.id, tm.idMovimiento, sm.id";
        query += " ORDER BY ma.fecha DESC";
        query += " LIMIT ? OFFSET ?";
        queryParams.push(Number(limit), Number(offset));

        const [result] = await db.query(query, queryParams);

        // Contar total de registros
        let totalQuery = `
            SELECT COUNT(DISTINCT ma.id) AS total
            FROM movimientos_almacen ma
            LEFT JOIN cat_tipo_movimiento tm ON ma.idTipoMovimiento = tm.idMovimiento
            LEFT JOIN cat_sub_movimientos sm ON ma.idTipoSubmovimiento = sm.id
        `;

        const totalQueryParams = [];
        let totalWhereConditions = [];

        if (fechaInicio && fechaFin) {
            const fechaInicioCompleta = `${fechaInicio} 00:00:00`;
            const fechaFinCompleta = `${fechaFin} 23:59:59`;
            totalWhereConditions.push("ma.fecha BETWEEN ? AND ?");
            totalQueryParams.push(fechaInicioCompleta, fechaFinCompleta);
        }

        if (tipoMovimiento) {
            totalWhereConditions.push("tm.idMovimiento = ?");
            totalQueryParams.push(tipoMovimiento);
        }

        if (subMovimiento) {
            totalWhereConditions.push("sm.id = ?");
            totalQueryParams.push(subMovimiento);
        }

        if (idAlmacen) {
            totalWhereConditions.push("(ma.idAlmacenOrigen = ? OR ma.idAlmacenDestino = ?)");
            totalQueryParams.push(idAlmacen, idAlmacen);
        }

        if (totalWhereConditions.length > 0) {
            totalQuery += " WHERE " + totalWhereConditions.join(" AND ");
        }

        const [[totalResult]] = await db.query(totalQuery, totalQueryParams);

        res.status(200).json({
            data: result,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / limit)
            },
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



// * consulta para la tabla movimientos almacen detalles
router.get('/obtener_movimientos_detalles/:idMovimiento', async (req, res) => {
    const { idMovimiento } = req.params;

    try {
        const [result] = await db.query(`
        SELECT 
            ma.id AS idMovimiento,
            ma.fecha,
            ma.idAlmacenOrigen AS idOrigen,
            ao.nombre AS nombreAlmacenOrigen,        
            ma.idAlmacenDestino AS idDestino,
            ad.nombre AS nombreAlmacenDestino,        
            ma.total,
            tm.movimiento AS tipo_movimiento,
            sm.tipoSubMovimiento,
            a.nombre AS autorizado_por,
            u.nombre AS usuario,
            p.nombre AS producto,
            pr.nombre_empresa AS proveedor,
            mad.cantidad,
            mad.costo_unitario,
            mad.subtotal
        FROM movimientos_almacen ma
        JOIN cat_tipo_movimiento tm ON ma.idTipoMovimiento = tm.idMovimiento
        JOIN cat_sub_movimientos sm ON ma.idTipoSubmovimiento = sm.id
        JOIN cat_autorizaciones a ON ma.idAutorizo = a.idAutorizo
        JOIN usuarios u ON ma.idUsuario = u.idUsuario
        JOIN movimientos_almacen_detalle mad ON ma.id = mad.idMovimiento
        JOIN productos p ON mad.idProducto = p.id
        JOIN proveedores pr ON mad.idProveedor = pr.id

        LEFT JOIN cat_almacenes ao ON ma.idAlmacenOrigen = ao.id
        LEFT JOIN cat_almacenes ad ON ma.idAlmacenDestino = ad.id
        WHERE ma.id = ?  
        ORDER BY ma.fecha DESC;

        `, [idMovimiento]);

        // Si hay resultados, enviarlos como respuesta
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Detalles no encontrados" });
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



// * buscar productos por codigo de producto
router.get('/obtener_movimientosXProductos_detalles/:idProducto?', async (req, res) => {
    const { idProducto } = req.params;
    const { fechaInicio, fechaFin } = req.query;

    console.log('idProducto', idProducto);
    console.log('fechaInicio', fechaInicio);
    console.log('idProducto', fechaFin);
    try {
        // Construcción de la consulta base
        let query = `
           SELECT iad.id AS idDetalle, 
                    iad.idMovimiento, 
                    iad.idProducto, 
                    iad.idAlmacen,
                    p.nombre AS nombreProducto, 
                    iad.idTipoMovimiento, 
                    tm.movimiento AS tipoMovimiento, 
                    sm.tipoSubMovimiento, 
                    ca.nombre AS nombre_almacen,
                    iad.cantidad, 
                    iad.costo_unitario, 
                    iad.precio_nuevo, 
                    iad.existencia_anterior, 
                    iad.existencia_nueva, 
                    iad.fecha AS fecha_movimiento, 
                    iad.idUsuario, 
                    u.nombre AS nombreUsuario, 
                    ud.nombre AS nombreUnidadMedida, 
                    iad.idUnidadMedida, 
                    iad.origen_movimiento, 
                    ia.cantidad AS stock_actual
                FROM inventario_almacen_detalle iad 
                JOIN inventario_almacen ia ON iad.idProducto = ia.idProducto 
                JOIN usuarios u ON u.idUsuario = iad.idUsuario 
                JOIN cat_tipo_movimiento tm ON tm.idMovimiento = iad.idTipoMovimiento 
                JOIN productos p ON p.id = iad.idProducto 
                JOIN cat_sub_movimientos sm ON sm.id = iad.idTipoSubmovimiento  
                JOIN cat_unidad_medida ud ON ud.id = iad.idUnidadMedida
                JOIN cat_almacenes ca ON iad.idAlmacen = ca.id

                WHERE 1 = 1
        `;

        const queryParams = [];

        // Si se especifica idProducto, se filtra por él
        if (idProducto) {
            query += " AND iad.idProducto = ?";
            queryParams.push(idProducto);
        }

        // Si se proporciona el rango de fechas, se filtra por él
        if (fechaInicio && fechaFin) {
            query += " AND iad.fecha >= ? AND iad.fecha < DATE_ADD(?, INTERVAL 1 DAY)";
            queryParams.push(fechaInicio, fechaFin);
        }

        query += " ORDER BY iad.fecha DESC";

        // Ejecutar la consulta
        const [result] = await db.query(query, queryParams);

        if (result.length === 0) {
            return res.status(200).json({ message: "No hay movimientos en el rango de fechas especificado", data: [] });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// * Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const query = `
        SELECT id AS idProducto, nombre
        FROM productos
        ORDER BY nombre ASC;
      `;
        const [result] = await db.query(query);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos." });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// * buscar productos por codigo
router.get('/buscar_producto/:codigo', async (req, res) => {
    const { codigo } = req.params; // Obtenemos el código desde los parámetros de la URL

    try {
        // Consulta para buscar el producto por su código
        const query = `SELECT * FROM productos WHERE codigo = ? LIMIT 1`;
        const [rows] = await db.query(query, [codigo]);

        if (rows.length > 0) {
            // Si se encontró el producto, lo retornamos
            return res.status(200).json(rows[0]);
        } else {
            // Si no se encuentra, se retorna un error 404
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar producto:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});


module.exports = router;
