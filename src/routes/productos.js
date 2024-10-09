const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/utngMarket', ['productos']); // Cambia el nombre de la colección a 'productos'

// Obtener todos los productos
router.get('/productos', (req, res, next) => {
    db.productos.find((err, productos) => {
        if (err) return next(err);
        res.json(productos);
    });
});

// Obtener un solo producto por ID
router.get('/productos/:id', (req, res, next) => {
    db.productos.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, producto) => {
        if (err) return next(err);
        res.json(producto);
    });
});

// Agregar un nuevo producto
router.post('/productos', (req, res, next) => {
    const producto = {
        id_producto: req.body.id_producto,
        id_vendedor: req.body.id_vendedor,
        nombre_producto: req.body.nombre_producto,
        cantidad_disponible: req.body.cantidad_disponible,
        categoria: req.body.categoria,
        precio: req.body.precio,
        fecha_publi: req.body.fecha_publi,
        descripcion: req.body.descripcion
    };
    
    db.productos.save(producto, (err, productoGuardado) => {
        if (err) return next(err);
        res.json(productoGuardado);
    });
});

// Eliminar un producto por ID
router.delete('/productos/:id', (req, res, next) => {
    db.productos.remove({_id: mongojs.ObjectId(req.params.id)}, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// Actualizar un producto por ID
router.put('/productos/:id', (req, res, next) => {
    const producto = req.body;
    const updateProducto = {};

    // Solo se actualizan los campos que vienen en el cuerpo de la petición
    if (producto.nombre_producto) {
        updateProducto.nombre_producto = producto.nombre_producto;
    }
    if (producto.cantidad_disponible) {
        updateProducto.cantidad_disponible = producto.cantidad_disponible;
    }
    if (producto.categoria) {
        updateProducto.categoria = producto.categoria;
    }
    if (producto.precio) {
        updateProducto.precio = producto.precio;
    }
    if (producto.fecha_publi) {
        updateProducto.fecha_publi = producto.fecha_publi;
    }
    if (producto.descripcion) {
        updateProducto.descripcion = producto.descripcion;
    }

    if (Object.keys(updateProducto).length === 0) {
        return res.status(400).json({ error: 'Bad Request' });
    } else {
        db.productos.update({_id: mongojs.ObjectId(req.params.id)}, {$set: updateProducto}, (err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
});

module.exports = router;
