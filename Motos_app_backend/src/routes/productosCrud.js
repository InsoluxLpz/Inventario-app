const express = require('express');
const { dbConexion } = require('../database/config');
const router = express.Router();
const db = dbConexion();

router.post('/agregar_producto', async (req, res) => {
    const { codigo, nombre, grupo, unidad_medida, precio, descripcion } = req.body;


    if (!codigo || !nombre || !grupo || !unidad_medida || !precio) {
        return res.status(400).json({ message: 'Hacen falta parámetros para guardar en la tabla' });
    }

    try {

        const existeQuery = `SELECT codigo FROM cat_productos_prueba WHERE codigo = ?`
        const [existe] = await db.query(existeQuery, [codigo]);

        if (existe.length > 0) {
            return res.status(400).json({ message: 'El código ya está registrado en la base de datos' });
        }

        const query = `
            INSERT INTO cat_productos_prueba (codigo, nombre, grupo, unidad_medida, precio, descripcion) VALUES (?,?,?,?,?,?)`

        const values = [codigo, nombre, grupo, unidad_medida, precio, descripcion];

        await db.query(query, values);

        return res.status(200).json('Producto agregado correctamente')

    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({ message: 'Error al agregar el producto' });
    }
});

router.get('/obtener_productos', async (req, res) => {

    const query = `SELECT * FROM cat_productos_prueba`

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

router.put('/actualizar_producto/:id', async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, grupo, unidad_medida, precio, descripcion } = req.body;

    if (!codigo || !nombre || !grupo || !unidad_medida || !precio) {
        return res.status(400).json({ message: 'Faltan parametros en la petición' })
    }

    if (!id) {
        return res.status(400).json({ message: 'No se encuentra id en la petición' })
    }

    try {

        const query = `SELECT * FROM cat_productos_prueba WHERE id = ?`

        const [existe] = await db.query(query, [id]);

        if (existe.length === 0) {
            return res.status(400).json({ message: 'No existe ningun producto con ese id' })
        };

        const updateQuery = `
            UPDATE cat_productos_prueba SET codigo = ?, nombre = ?, grupo = ?, unidad_medida = ?, precio = ?, descripcion = ? WHERE id = ?`

        const values = [codigo, nombre, grupo, unidad_medida, precio, descripcion, id]

        await db.query(updateQuery, values);

        const [updateProducto] = await db.query('SELECT * FROM cat_productos_prueba WHERE id = ?', [id]);


        return res.status(200).json(updateProducto[0]);

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// * actualizar status en la tabla de productos
router.put('/actualizar_status_productos/:id', async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json('Faltan parametros para actualizar el campo');
    }

    const query = `UPDATE cat_productos_prueba SET status = 0 WHERE id = ?`

    try {
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json('No hay datos en la tabla');
        }
        return res.status(200).json(results);

    } catch (err) {
        console.error('Error al obtener el crédito:', err);
        return res.status(500).json({ errors: ['Error en el servidor'] });
    }

});

router.delete('/eliminar_producto/:id', async (req, res) => {

});

module.exports = router;
