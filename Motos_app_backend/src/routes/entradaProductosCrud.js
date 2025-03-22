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
        total
    } = req.body;

    console.log('Datos recibidos:', { fecha, idTipoMovimiento, idTipoSubmovimiento, idAutorizo, productos, idUsuario, total });

    // Validación de datos
    if (!fecha || !productos || productos.length === 0 ||
        !idTipoMovimiento || !idTipoSubmovimiento || !idAutorizo || !idUsuario) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios y debe haber al menos un producto' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction(); // Iniciar transacción

        // Insertar en movimientos_almacen (solo una vez)
        const queryMaestro = `
            INSERT INTO movimientos_almacen
            (fecha, idTipoMovimiento, idTipoSubmovimiento, idAutorizo, idUsuario, total)
            VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.query(queryMaestro, [
            fecha,
            idTipoMovimiento,
            idTipoSubmovimiento,
            idAutorizo,
            idUsuario,
            total
        ]);

        const idMovimiento = result.insertId; // Usar el mismo idMovimiento para todos los productos
        console.log('Movimiento insertado con ID:', result.insertId); // Verifica si el movimiento se inserta solo una vez

        // Insertar cada producto en movimientos_almacen_detalle
        const queryDetalle = `
            INSERT INTO movimientos_almacen_detalle
            (idMovimiento, idProducto, idProveedor, cantidad, costo_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)`;

        // Para cada producto, asignamos el mismo idMovimiento y el idTipoSubmovimiento
        for (let producto of productos) {
            const idProducto = producto.idProducto?.value || producto.idProducto;
            const idProveedor = producto.idProveedor?.value || null;
            const cantidad = Number(producto.cantidad);
            const costo_unitario = Number(producto.costo_unitario);
            const subtotal = cantidad * costo_unitario;

            // Insertamos el producto en la tabla
            await connection.query(queryDetalle, [
                idMovimiento,  // El idMovimiento es el mismo para todos los productos
                idProducto,
                idProveedor,
                cantidad,
                costo_unitario,
                subtotal
            ]);
        }

        await connection.commit(); // Confirmar transacción
        res.status(201).json({ message: "Productos agregados correctamente", idMovimiento });

    } catch (error) {
        if (connection) await connection.rollback(); // Revertir cambios en caso de error
        console.error("Error al insertar el movimiento:", error);
        res.status(500).json({ message: "Error al registrar el movimiento", error });
    } finally {
        if (connection) connection.release(); // Liberar la conexión
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
        const query = `UPDATE movimientos_almacen SET fecha = ?, cantidad = ?, costo_unitario = ?, producto = ?, tipo = ?, autorizo = ?, proveedor = ? WHERE id = ?`;
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
        const [autorizaciones] = await db.query("SELECT idAutorizo, nombre FROM autorizaciones");
        const [tiposEntrada] = await db.query("SELECT id, tipoSubMovimiento FROM sub_movimientos");
        const [tipoMovimiento] = await db.query("SELECT idMovimiento, movimiento FROM tipo_movimiento");

        res.status(200).json({
            proveedores,
            productos,
            autorizaciones,
            tiposEntrada,
            tipoMovimiento
        });
    } catch (error) {
        console.error("Error al obtener listas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }

});

// * consulta buena falta la autorizacion
router.get('/obtener_inventario', async (req, res) => {
    try {
        const [result] = await db.query(`                              
                SELECT 
                    ia.idProducto as idProducto,
                    ia.cantidad as cantidad,
                    p.nombre as nombreProducto,
                    p.codigo as codigo,
                    cum.nombre as unidadMedida
                FROM inventario_almacen ia
                left join productos p on p.id = ia.idProducto
                left join cat_unidad_medida cum on ia.idUnidadMedida = cum.id;
        `);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }

});

// * consulta que se puede pedir mas adelante para la tabla movimientos almacen
router.get('/obtener_movimientos', async (req, res) => {
    try {
        const [result] = await db.query(`                
                select 
                ma.id as idMovimiento,
                ma.fecha as fecha_movimiento,
                u.nombre as nombreUsuario,
                a.nombre as nombreAutorizo,
                GROUP_CONCAT(
                    CONCAT(mad.idProducto, ' - ', mad.cantidad, ' - ', mad.costo_unitario, ' - ', mad.subtotal) 
                    SEPARATOR ', '
                ) as detalles
            from movimientos_almacen ma
            left join movimientos_almacen_detalle mad on ma.id = mad.idMovimiento
            left join autorizaciones a on ma.idAutorizo = a.idAutorizo
            left join usuarios u on u.idUsuario = ma.idUsuario
            group by ma.id;  -- Agrupa por movimiento
        `);

        res.status(200).json(result);
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
            JOIN tipo_movimiento tm ON ma.idTipoMovimiento = tm.idMovimiento
            JOIN sub_movimientos sm ON ma.idTipoSubmovimiento = sm.id
            JOIN autorizaciones a ON ma.idAutorizo = a.idAutorizo
            JOIN usuarios u ON ma.idUsuario = u.idUsuario
            JOIN movimientos_almacen_detalle mad ON ma.id = mad.idMovimiento
            JOIN productos p ON mad.idProducto = p.id
            JOIN proveedores pr ON mad.idProveedor = pr.id
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
router.get('/obtener_movimientosXProductos_detalles/:idProducto', async (req, res) => {
    const { idProducto } = req.params;
    const { fechaInicio, fechaFin } = req.query;

    try {
        // 1. Verificar si el producto existe
        const [producto] = await db.query(`SELECT * FROM productos WHERE id = ?`, [idProducto]);
        if (producto.length === 0) {
            return res.status(404).json({ message: "El producto no existe" });
        }

        // 2. Construir la consulta de movimientos
        let query = `
           SELECT iad.id AS idDetalle, 
       iad.idMovimiento, 
       iad.idProducto, 
       p.nombre AS nombreProducto, 
       iad.idTipoMovimiento, 
       tm.movimiento AS tipoMovimiento, 
       sm.tipoSubMovimiento, 
       iad.cantidad, 
       iad.costo_unitario, 
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
JOIN tipo_movimiento tm ON tm.idMovimiento = iad.idTipoMovimiento 
JOIN productos p ON p.id = iad.idProducto 
JOIN sub_movimientos sm ON sm.id = iad.idTipoSubmovimiento  
JOIN cat_unidad_medida ud ON ud.id = iad.idUnidadMedida
WHERE iad.idProducto = ?
        `;

        const queryParams = [idProducto];

        // 3. Agregar rango de fechas si se proporciona
        if (fechaInicio && fechaFin) {
            query += " AND iad.fecha BETWEEN ? AND ?";
            queryParams.push(fechaInicio, fechaFin);
        }

        query += " ORDER BY iad.fecha DESC";

        // 4. Ejecutar la consulta de movimientos
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





module.exports = router;
