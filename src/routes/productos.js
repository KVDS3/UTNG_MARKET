const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/utngMarket', ['productos']); // Cambia el nombre de la colección a 'productos'

// Validación del ObjectId
function isValidObjectId(id) {
    return mongojs.ObjectId.isValid(id) && id.length === 24;
}

// Obtener todos los productos
router.get('/productos', (req, res, next) => {
    db.productos.find((err, productos) => {
        if (err) return next(err);
        res.json(productos);
    });
});

// Obtener un solo producto por ID
router.get('/productos/:id', (req, res, next) => {
    const id = req.params.id;
    
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    db.productos.findOne({ _id: mongojs.ObjectId(id) }, (err, producto) => {
        if (err) return next(err);
        res.json(producto);
    });
});

// Agregar un nuevo producto
router.post('/productos', (req, res, next) => {
    const producto = {
        id_vendedor: req.body.id_vendedor,
        nombre_producto: req.body.nombre_producto,
        cantidad_dispo: req.body.cantidad_dispo,
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
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    db.productos.remove({ _id: mongojs.ObjectId(id) }, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// Actualizar un producto por ID
router.put('/productos/:id', (req, res, next) => {
    const id = req.params.id;
    const producto = req.body;
    const updateProducto = {};

    // Validar que el ID sea correcto
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Solo se actualizan los campos que vienen en el cuerpo de la petición
    if (producto.nombre_producto) {
        updateProducto.nombre_producto = producto.nombre_producto;
    }
    if (producto.cantidad_dispo) {
        updateProducto.cantidad_dispo = producto.cantidad_dispo;
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
        db.productos.update({ _id: mongojs.ObjectId(id) }, { $set: updateProducto }, (err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
});

module.exports = router;
