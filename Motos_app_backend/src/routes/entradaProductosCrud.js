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
            (fecha, tipo_movimiento_id, tipo_entrada_id, autorizo_id, proveedor_id, usuario_id) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await connection.query(queryMaestro, 
            [fecha, tipo_movimiento_id.value, tipo_entrada_id.value, autorizo_id.value, proveedor_id.value, usuario_id]);

        const id_movimiento = result.insertId;

        const subtotal = cantidad * costo_unitario;

        // Insertar cada producto en movimientos_almacen_detalle
        const queryDetalle = `
            INSERT INTO movimientos_almacen_detalle 
            (id_movimiento, producto_id, cantidad, costo_unitario, subtotal) 
            VALUES (?,?,?,?,?)`;

        connection.query(queryDetalle, [id_movimiento, producto_id.value, cantidad, costo_unitario, subtotal])

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
            const [productos] = await db.query("SELECT * FROM productos");
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
// router.get('/obtener_inventario', async (req, res) => {
//     try {
//         const [result] = await db.query(`                
//                     SELECT 
//                     ma.fecha fecha_movimiento, cantidad , costo_unitario, proveedor_id,
//                     p.id AS idProducto,
//                     p.nombre AS nombreProducto,
//                     pr.id AS proveedor_id,
//                     pr.nombre_proveedor AS proveedor_nombre,
//                     a.idAutorizo AS autorizacion_id,
//                     a.nombre AS autorizo,
//                     t.id AS tipo_entrada_id,
//                     t.tipo_entrada AS tipo_entrada,
//                     tm.idMovimiento AS tipo_movimiento_id,
//                     tm.movimiento AS tipo_movimiento
//                 FROM 
//                     movimientos_almacen ma
//                 LEFT JOIN productos p ON ma.producto_id = p.id
//                 LEFT JOIN productos_proveedor pp ON pp.idProducto = p.id
//                 LEFT JOIN proveedores pr ON pr.id = pp.idProveedor
//                 LEFT JOIN autorizaciones a ON a.idAutorizo = ma.autorizo_id
//                 LEFT JOIN tipo_entrada t ON t.id = ma.tipo_movimiento_id
//                 LEFT JOIN tipo_movimiento tm ON tm.idMovimiento = ma.tipo_movimiento_id;
//         `);
        
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error al obtener datos:", error);
//         res.status(500).json({ message: "Error en el servidor" });
//     }
    
// });

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
