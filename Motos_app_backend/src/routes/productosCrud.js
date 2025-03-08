const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_producto', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);

    const { codigo, nombre, precio, descripcion, grupo, unidad_medida, proveedores, idUsuario } = req.body;

    if (!codigo || !nombre || !grupo || !unidad_medida || !precio || !idUsuario || !proveedores.length) {
        return res.status(400).json({ message: 'Faltan parámetros para guardar en la base de datos' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insertar producto
        const insertProductoQuery = `
            INSERT INTO productos (codigo, nombre, precio, descripcion, idGrupo, idUnidadMedida, idUsuario, fecha_registro) 
            VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`;
        const valuesProducto = [codigo, nombre, precio, descripcion, grupo, unidad_medida, idUsuario];

        const [productoResult] = await connection.query(insertProductoQuery, valuesProducto);
        const idProducto = productoResult.insertId;

        console.log("idProducto:", idProducto);

        // Insertar proveedores asociados al producto
        if (proveedores.length > 0) {
            const valuesProveedores = proveedores.map(idProveedor => [idProducto, idProveedor]);
            const insertProveedorQuery = `INSERT INTO productos_proveedor (idProducto, idProveedor) VALUES ?`;
            await connection.query(insertProveedorQuery, [valuesProveedores]);
        }

        await connection.commit();
        return res.status(200).json({ message: 'Producto agregado correctamente', idProducto });

    } catch (error) {
        await connection.rollback();
        console.error('Error al agregar el producto:', error.message);
        return res.status(500).json({ message: error.message || 'Error al agregar el producto' });
    } finally {
        connection.release();
    }
});


router.get('/obtener_productos', async (req, res) => {
    console.log(req.body)
    const query = `
SELECT 
      p.*, 
    g.nombre AS grupo,
    u.nombre AS unidad_medida,
    COALESCE(st.stock_disponible, 0) AS stock_disponible, 
    JSON_ARRAYAGG(
        JSON_OBJECT('id', pr.id, 'nombre', pr.nombre_proveedor)
    ) AS proveedores
FROM 
    productos p
JOIN 
    cat_grupos_prueba g ON p.idGrupo = g.id
JOIN 
    cat_unidad_medida u ON p.idUnidadMedida = u.id
LEFT JOIN 
    productos_proveedor pp ON p.id = pp.idProducto
LEFT JOIN (
    -- Subconsulta para evitar duplicaciones de proveedores antes del JSON_ARRAYAGG
    SELECT DISTINCT id, nombre_proveedor FROM proveedores
) pr ON pp.idProveedor = pr.id
LEFT JOIN (
    -- Subconsulta para calcular el stock por producto
    SELECT producto_id, SUM(cantidad) AS stock_disponible 
    FROM stock_almacen 
    GROUP BY producto_id
) st ON p.id = st.producto_id
GROUP BY 
    p.id;


    `;


    try {
        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No se encontraron productos con los datos solicitados');
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});


router.put('/actualizar_producto/:id', async (req, res) => {
    console.log("Datos recibidos en el backend para actualizar producto:", req.body);

    const { codigo, nombre, precio, descripcion, grupo, unidad_medida, idUsuario, proveedores } = req.body;
    const { id } = req.params;

    // Validar los parámetros
    if (!codigo || !nombre || !grupo || !unidad_medida || !precio || !idUsuario || !proveedores) {
        return res.status(400).json({ message: 'Faltan parámetros para actualizar el producto' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Iniciar transacción

        // Actualizar el producto
        const updateProductoQuery = `
            UPDATE productos
            SET codigo = ?, nombre = ?, precio = ?, descripcion = ?, idGrupo = ?, idUnidadMedida = ? 
            WHERE id = ?`;
        const valuesProducto = [codigo, nombre, precio, descripcion, grupo, unidad_medida, id];
        await connection.query(updateProductoQuery, valuesProducto);

        // Eliminar los proveedores antiguos
        const deleteProveedoresQuery = `DELETE FROM productos_proveedor WHERE idProducto = ?`;
        await connection.query(deleteProveedoresQuery, [id]);

        // Insertar los nuevos proveedores
        const valuesProveedores = proveedores.map(idProveedor => [id, idProveedor]);
        const insertProveedorQuery = `INSERT INTO productos_proveedor (idProducto, idProveedor) VALUES ?`;
        await connection.query(insertProveedorQuery, [valuesProveedores]);

        await connection.commit(); // Confirmar transacción
        return res.status(200).json({ message: 'Producto actualizado correctamente' });

    } catch (error) {
        await connection.rollback(); // Revertir cambios si hay error
        console.error('Error al actualizar el producto:', error.message);
        return res.status(500).json({ message: error.message || 'Error al actualizar el producto' });
    } finally {
        connection.release(); // Liberar conexión
    }
});


router.delete('/eliminar_producto/:id', async (req, res) => {

});

router.post('/agregar_entrada', async (req, res) => {
    const { producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor } = req.body

    if (!producto || !fecha || !cantidad || !costo_unitario || !tipo || !autorizo || !proveedor) {
        return res.status(400).json({ message: 'Hacen falta parámetros para guardar en la tabla' });
    }

    try {
        const query = ` INSERT INTO productos_entradas (producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor) VALUES (?,?,?,?,?,?,?)`

        const values = [producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor];

        await db.query(query, values);

        return res.status(200).json('Entrada agregada correctamente')
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({ message: 'Error al agregar el producto' });
    }

});

router.get('/obtener_entradas', async (req, res) => {
    try {

        const query = `SELECT * FROM productos_entradas`;

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No hay valores que mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

router.get('/obtener_grupos', async (req, res) => {

    const query = `SELECT * FROM cat_grupos_prueba`

    try {

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No se encontraron valores a mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }

});

router.get('/obtener_unidad_medida', async (req, res) => {

    const query = `SELECT * FROM cat_unidad_medida`

    try {

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No se encontraron valores a mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }

});





router.delete('/eliminar_producto/:id', async (req, res) => {

});

router.post('/agregar_entrada', async (req, res) => {
    const { producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor } = req.body

    if (!producto || !fecha || !cantidad || !costo_unitario || !tipo || !autorizo || !proveedor) {
        return res.status(400).json({ message: 'Hacen falta parámetros para guardar en la tabla' });
    }

    try {
        const query = ` INSERT INTO productos_entradas (producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor) VALUES (?,?,?,?,?,?,?)`

        const values = [producto, fecha, cantidad, costo_unitario, tipo, autorizo, proveedor];

        await db.query(query, values);

        return res.status(200).json('Entrada agregada correctamente')
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({ message: 'Error al agregar el producto' });
    }

});

router.get('/obtener_entradas', async (req, res) => {
    try {

        const query = `SELECT * FROM productos_entradas`;

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No hay valores que mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

router.get('/obtener_grupos', async (req, res) => {

    const query = `SELECT * FROM cat_grupos_prueba`

    try {

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No se encontraron valores a mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }

});

router.get('/obtener_unidad_medida', async (req, res) => {

    const query = `SELECT * FROM cat_unidad_medida`

    try {

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(404).json('No se encontraron valores a mostrar en la tabla')
        }

        return res.status(200).json(results)

    } catch (error) {
        console.error('Error al obtener los prodructos:', error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }

});

module.exports = router;
