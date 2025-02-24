const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_producto', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);

    const { codigo, nombre, precio, descripcion, grupo, unidad_medida, proveedores } = req.body;


    if (!codigo || !nombre || !grupo || !unidad_medida || !precio || !proveedores) {
        return res.status(400).json({ message: 'Faltan parámetros para guardar en la base de datos' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Iniciar transacción

        const grupoQuery = `SELECT 1 FROM cat_grupos_prueba WHERE id = ? LIMIT 1`;
        const [grupoExists] = await connection.query(grupoQuery, [grupo]);

        // Verifica si el resultado contiene al menos un objeto, no importa el valor
        if (!grupoExists || grupoExists.length === 0) {
            return res.status(400).json({ message: 'El grupo no existe' });
        }


        // Validar que el idUnidadMedida existe en la tabla cat_unidad_medida
        const unidadMedidaQuery = `SELECT 1 FROM cat_unidad_medida WHERE id = ? LIMIT 1`;
        const [unidadMedidaExists] = await connection.query(unidadMedidaQuery, [unidad_medida]);
        if (unidadMedidaExists.length === 0) {
            return res.status(400).json({ message: 'La unidad de medida no existe' });
        }

        // Insertar el producto
        const insertProductoQuery = `
            INSERT INTO cat_productos_prueba (codigo, nombre, precio, descripcion, idGrupo, idUnidadMedida) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        const valuesProducto = [codigo, nombre, precio, descripcion, grupo, unidad_medida];

        const [productoResult] = await connection.query(insertProductoQuery, valuesProducto);
        const idProducto = productoResult.insertId; // Obtener el ID del nuevo producto

        console.log("idProducto:", idProducto); // Verificar si idProducto tiene un valor válido

        // Verificar que los proveedores sean válidos
        for (let id of proveedores) {
            const proveedorQuery = `SELECT 1 FROM cat_proveedores_prueba WHERE id = ? LIMIT 1`;
            const [proveedorExists] = await connection.query(proveedorQuery, [id]);

            if (proveedorExists.length === 0) {
                return res.status(400).json({ message: `El proveedor con ID ${id} no existe` });
            }
        }

        // Insertar los proveedores
        const valuesProveedores = proveedores.map(idProveedor => [idProducto, idProveedor]);
        const insertProveedorQuery = `INSERT INTO cat_productos_proveedor (idProducto, idProveedor) VALUES ?`;
        await connection.query(insertProveedorQuery, [valuesProveedores]);

        await connection.commit(); // Confirmar transacción
        return res.status(200).json({ message: 'Producto agregado correctamente', idProducto });

    } catch (error) {
        await connection.rollback(); // Revertir cambios si hay error
        console.error('Error al agregar el producto:', error.message);
        return res.status(500).json({ message: error.message || 'Error al agregar el producto' });
    } finally {
        connection.release(); // Liberar conexión
    }
});



router.get('/obtener_productos', async (req, res) => {
    console.log(req.body)
    const query = `
SELECT 
    p.*, 
    g.nombre AS grupo,
    u.nombre AS unidad_medida,
    GROUP_CONCAT(pr.nombreProveedor) AS proveedores
FROM 
    cat_productos_prueba p
JOIN 
    cat_grupos_prueba g ON p.idGrupo = g.id  -- Relación entre productos y grupos
JOIN 
    cat_unidad_medida u ON p.idUnidadMedida = u.id  -- Relación entre productos y unidad de medida
LEFT JOIN 
    cat_productos_proveedor pp ON p.id = pp.idProducto  -- Relación con la tabla intermedia
LEFT JOIN 
    cat_proveedores_prueba pr ON pp.idProveedor = pr.id  
GROUP BY 
    p.id;  -- Agrupamos por el id del producto para obtener todos los proveedores asociados

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

    const { nombre, precio, descripcion, grupo, unidad_medida, proveedores } = req.body;
    const { id } = req.params; // ID del producto a actualizar

    // Validar los parámetros
    if (!nombre || !grupo || !unidad_medida || !precio || !proveedores) {
        return res.status(400).json({ message: 'Faltan parámetros para actualizar el producto' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Iniciar transacción


        // Actualizar el producto
        const updateProductoQuery = `
            UPDATE cat_productos_prueba 
            SET nombre = ?, precio = ?, descripcion = ?, idGrupo = ?, idUnidadMedida = ? 
            WHERE id = ?`;
        const valuesProducto = [nombre, precio, descripcion, grupo, unidad_medida, id];
        await connection.query(updateProductoQuery, valuesProducto);

        // Verificar que los proveedores sean válidos
        for (let idProveedor of proveedores) {
            const proveedorQuery = `SELECT 1 FROM cat_proveedores_prueba WHERE id = ? LIMIT 1`;
            const [proveedorExists] = await connection.query(proveedorQuery, [idProveedor]);

            if (proveedorExists.length === 0) {
                return res.status(400).json({ message: `El proveedor con ID ${idProveedor} no existe` });
            }
        }

        // Eliminar los proveedores antiguos
        const deleteProveedoresQuery = `DELETE FROM cat_productos_proveedor WHERE idProducto = ?`;
        await connection.query(deleteProveedoresQuery, [id]);

        // Insertar los nuevos proveedores
        const valuesProveedores = proveedores.map(idProveedor => [id, idProveedor]);
        const insertProveedorQuery = `INSERT INTO cat_productos_proveedor (idProducto, idProveedor) VALUES ?`;
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

module.exports = router;
