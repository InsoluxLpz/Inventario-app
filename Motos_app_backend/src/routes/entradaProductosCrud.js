const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();



router.post('/agregar_inventario', async (req, res) => { 
    const { 
        fecha, 
        producto_id, 
        tipo_movimiento_id, 
        tipo_entrada_id, 
        autorizo_id, 
        proveedor_id,
        cantidad, 
        costo_unitario,
        usuario_id 
    } = req.body;

    console.log('datos recibidos',{
        fecha, 
        producto_id, 
        tipo_movimiento_id, 
        tipo_entrada_id, 
        autorizo_id, 
        proveedor_id,
        cantidad, 
        costo_unitario,
        usuario_id 
    });

    // Validación de datos
    if (!fecha || !producto_id ||
        !tipo_movimiento_id || !tipo_entrada_id || !autorizo_id || 
        !proveedor_id || !usuario_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction(); // Iniciar transacción

        // Insertar en movimientos_almacen
        const queryMaestro = `
            INSERT INTO movimientos_almacen 
            (fecha, tipo_movimiento_id, tipo_entrada_id, autorizo_id, usuario_id) 
            VALUES (?, ?, ?, ?, ?)`;

        const [result] = await connection.query(queryMaestro, 
            [fecha, tipo_movimiento_id.value, tipo_entrada_id.value, autorizo_id.value, usuario_id]);

        const id_movimiento = result.insertId;

        const subtotal = cantidad * costo_unitario;

        // Insertar cada producto en movimientos_almacen_detalle
        const queryDetalle = `
            INSERT INTO movimientos_almacen_detalle 
            (id_movimiento, producto_id, proveedor_id, cantidad, costo_unitario, subtotal) 
            VALUES (?,?,?,?,?,?)`;

        connection.query(queryDetalle, [id_movimiento, producto_id.value, proveedor_id.value, cantidad, costo_unitario, subtotal])

        await connection.commit(); // Confirmar transacción
        res.status(201).json({ message: "Producto agregado correctamente", id_movimiento });

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
            const [proveedores] = await db.query("SELECT id, nombre_proveedor FROM proveedores");
            const [productos] = await db.query(`
                SELECT 
                p.id,
                p.nombre as nombre,
                pp.idProveedor as id_proveedor
            FROM productos p
            left join productos_proveedor pp on p.id = pp.idProducto`);
            const [autorizaciones] = await db.query("SELECT idAutorizo, nombre FROM autorizaciones");
            const [tiposEntrada] = await db.query("SELECT id, tipo_entrada FROM tipo_entrada");
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


// * consulta que se puede pedir mas adelante para la tabla movimientos almacen
router.get('/obtener_movimientos', async (req, res) => {
    try {
        const [result] = await db.query(`                
                select 
                mad.id_movimiento as idMovimiento,
                ma.fecha as fecha_movimiento,
                u.nombre as nombreUsuario,
                a.nombre as nombreAutorizo
            from movimientos_almacen ma
            left join movimientos_almacen_detalle mad on ma.id = mad.id_movimiento
            left join autorizaciones a on ma.autorizo_id = a.idAutorizo
            left join usuarios u on u.idUsuario = ma.usuario_id;
        `);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
    
});

// * consulta para la tabla movimientos almacen detalles
router.get('/obtener_movimientos_detalles/:idMovimiento', async (req, res) => {
    const { idMovimiento } = req.params; // Obtener el parámetro de la URL
    
    try {
        const [result] = await db.query(`
            SELECT 
                ma.id AS movimiento_id,
                ma.fecha,
                tm.movimiento AS tipo_movimiento,
                te.tipo_entrada,
                a.nombre AS autorizado_por,
                u.nombre AS usuario,
                p.nombre AS producto,
                pr.nombre_empresa AS proveedor,
                mad.cantidad,
                mad.costo_unitario,
                mad.subtotal
            FROM movimientos_almacen ma
            JOIN tipo_movimiento tm ON ma.tipo_movimiento_id = tm.idMovimiento
            JOIN tipo_entrada te ON ma.tipo_entrada_id = te.id
            JOIN autorizaciones a ON ma.autorizo_id = a.idAutorizo
            JOIN usuarios u ON ma.usuario_id = u.idUsuario  
            JOIN movimientos_almacen_detalle mad ON ma.id = mad.id_movimiento
            JOIN productos p ON mad.producto_id = p.id
            JOIN proveedores pr ON mad.proveedor_id = pr.id
            WHERE ma.id = ?  -- Filtrar por el ID del movimiento
            ORDER BY ma.fecha DESC;
        `, [idMovimiento]);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// * consulta buena falta la autorizacion
router.get('/obtener_inventario', async (req, res) => {
    try {
        const [result] = await db.query(`                
                    
SELECT 
	sa.producto_id as idProducto,
	sa.cantidad as cantidad,
	p.nombre as nombreProducto,
	p.codigo as codigo
FROM stock_almacen sa
left join productos p on p.id = sa.producto_id;
        `);
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
    
});




module.exports = router;
