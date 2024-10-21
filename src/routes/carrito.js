const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/utngMarket', ['carrito']); // Cambia el nombre de la colección a 'carrito'

// Validación del ObjectId
function isValidObjectId(id) {
    return mongojs.ObjectId.isValid(id) && id.length === 24;
}

// Obtener todos los productos en el carrito
router.get('/carrito', (req, res, next) => {
    db.carrito.find((err, productos) => {
        if (err) return next(err);
        res.json(productos);
    });
});

// Obtener un solo producto del carrito por ID
router.get('/carrito/:id', (req, res, next) => {
    const id = req.params.id;
    
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    db.carrito.findOne({ _id: mongojs.ObjectId(id) }, (err, producto) => {
        if (err) return next(err);
        res.json(producto);
    });
});

// Agregar un nuevo producto al carrito
router.post('/carrito', (req, res, next) => {
    const carrito = {
        id_usuario: req.body.id_usuario,
        estado: 'activo',
        fecha_creacion: new Date(),
        productos: [
            {
                id_producto: req.body.id_producto,
                id_vendedor: req.body.id_vendedor,
                nombre_producto: req.body.nombre_producto,
                cantidad_dispo: req.body.cantidad_dispo,
                categoria: req.body.categoria,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                fecha_publicacion: req.body.fecha_publicacion,
                imagen: req.body.imagen // Agrega la propiedad imagen
            }
        ]
    };

    db.carrito.insert(carrito, (err, carritoGuardado) => {
        if (err) return next(err);
        res.json(carritoGuardado);
    });
});

// Eliminar un producto del carrito por ID
router.delete('/carrito/:id', (req, res, next) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    db.carrito.remove({ _id: mongojs.ObjectId(id) }, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// Actualizar un producto del carrito por ID
router.put('/carrito/:id', (req, res, next) => {
    const id = req.params.id;
    const producto = req.body;
    const updateProducto = {};

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Actualiza solo los campos que vienen en el cuerpo de la petición
    if (producto.productos) {
        updateProducto.productos = producto.productos;
    }

    if (Object.keys(updateProducto).length === 0) {
        return res.status(400).json({ error: 'Bad Request' });
    } else {
        db.carrito.update({ _id: mongojs.ObjectId(id) }, { $set: updateProducto }, (err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
});

module.exports = router;
