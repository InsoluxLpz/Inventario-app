const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();



router.post('/agregar_inventario', async (req, res) => {
    
        const { fecha, cantidad, costo_unitario, producto, tipoMovimiento, autorizo_id, usuario_id, proveedor } = req.body;
        
        
        console.log('Fecha:', fecha);
        console.log('Cantidad:', cantidad);
        console.log('Costo Unitario:', costo_unitario);
        console.log('Producto:', producto);
        console.log('Tipo de Movimiento:', tipoMovimiento);
        console.log('Autorizo ID:', autorizo_id);
        console.log('Usuario ID:', usuario_id);
        console.log('Proveedor:', proveedor);
        
        // Validación básica
        if (!fecha || !cantidad || !costo_unitario || !producto || !tipoMovimiento || !autorizo_id || !usuario_id || !proveedor) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Insertar en movimientos_almacen
        const queryMaestro = `
            INSERT INTO movimientos_almacen 
            (fecha, cantidad, costo_unitario, producto_id, tipo_movimiento_id, autorizo_id, proveedor_id, usuario_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await connection.query(queryMaestro, 
            [fecha, cantidad, costo_unitario, producto.value, tipoMovimiento.value, autorizo_id.value, proveedor.value, usuario_id]);

        const id_movimiento = result.insertId;

        // Insertar en movimientos_almacen_detalle
        const queryDetalle = `
            INSERT INTO movimientos_almacen_detalle 
            (id_movimiento, producto_id, cantidad, costo_unitario) 
            VALUES (?, ?, ?, ?)`;

        await connection.query(queryDetalle, [id_movimiento, producto.value, cantidad, costo_unitario]);

        await connection.commit();
        res.status(201).json({ message: "Producto agregado correctamente", id: id_movimiento });

    } catch (error) {
        await connection.rollback();
        console.error("Error al insertar el producto:", error);
        res.status(500).json({ message: "Error al agregar el producto" });
    } finally {
        connection.release();
    }
})





// * Obtener todos los registros del inventario
router.get('/obtener_inventario', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id,
                a.fecha,
                p.nombre AS producto,  
                te.tipo_entrada AS tipo, 
                a.cantidad,
                a.costo_unitario,
                aut.nombre AS autorizo,  
                prov.nombre_proveedor AS proveedores
            FROM movimientos_almacen a
            JOIN productos p ON a.producto_id = p.id
            JOIN cat_tipo_entrada te ON a.tipo_id = te.id  
            JOIN autorizaciones aut ON a.autorizo_id = aut.idAutorizo 
            JOIN proveedores prov ON a.proveedor_id = prov.id
        `;
        const [results] = await db.query(query);

        console.log('Resultados de la consulta:', results);

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

// * endpoint para mandar autorizaciones
// router.get('/obtener_autorizaciones', async (req, res) => {
//     const query = `SELECT idAutorizo, nombre FROM autorizaciones`; 

//     try {
//         const [results] = await db.query(query);
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No hay datos en la tabla' });
//         }
//         return res.status(200).json(results);
//     } catch (error) {
//         console.error('Error al obtener los autorizadores', error);
//         return res.status(500).json({ error: 'Error en el servidor' });
//     }
// });

// // * endpoint para mandar autorizaciones
// router.get('/obtener_tipo_entradas', async (req, res) => {
//     const query = `SELECT id, tipo_entrada FROM cat_tipo_entrada`; 

//     try {
//         const [results] = await db.query(query);
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No hay datos en la tabla' });
//         }
//         return res.status(200).json(results);
//     } catch (error) {
//         console.error('Error al obtener los autorizadores', error);
//         return res.status(500).json({ error: 'Error en el servidor' });
//     }
// });

// * peticion unificada para cargar listas
router.get('/obtener_listas', async (req, res) => {
    try {
        const [proveedores] = await db.query("SELECT id, nombre_proveedor FROM proveedores");
        const [productos] = await db.query("SELECT * FROM productos");
        const [autorizaciones] = await db.query("SELECT idAutorizo, nombre FROM autorizaciones");
        const [tiposEntrada] = await db.query("SELECT id, tipo_entrada FROM cat_tipo_entrada");
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


module.exports = router;
