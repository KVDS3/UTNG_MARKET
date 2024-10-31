const router = require('express').Router();
const mongojs = require('mongojs');

const db = mongojs('127.0.0.1/UTNGMARKET', ['carrito']); // Cambia el nombre de la colección a 'carrito'

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
    const { id_usuario, productos } = req.body;

    // Validar que id_usuario y productos no sean nulos o indefinidos
    if (!id_usuario || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: 'id_usuario y productos son requeridos.' });
    }

    // Validar cada producto
    for (const producto of productos) {
        const { id_producto, id_vendedor, nombre_producto, cantidad_dispo, categoria, precio, descripcion, fecha_publicacion, imagen } = producto;
        if (!id_producto || !id_vendedor || !nombre_producto || cantidad_dispo == null || !categoria || precio == null || !descripcion || !fecha_publicacion) {
            return res.status(400).json({ error: 'Todos los campos del producto son requeridos.' });
        }
    }

    const carrito = {
        id_usuario,
        estado: 'activo',
        fecha_creacion: new Date(),
        productos
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
