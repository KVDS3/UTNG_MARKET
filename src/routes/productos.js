const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const multer = require('multer');
const fs = require('fs'); // Para manejar el sistema de archivos
const path = require('path'); // Para manejar rutas de archivos
const db = mongojs('127.0.0.1/utngMarket', ['productos']);

// Configuración de Multer para manejar las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
    }
});

const upload = multer({ storage });

// Validar ObjectId
function isValidObjectId(id) {
    return mongojs.ObjectId.isValid(id);
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

router.post('/productos', upload.single('imagen'), (req, res, next) => {
    const imagenUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Genera la URL completa

    const producto = {
        id_vendedor: req.body.id_vendedor,
        nombre_producto: req.body.nombre_producto,
        cantidad_dispo: req.body.cantidad_dispo,
        categoria: req.body.categoria,
        precio: req.body.precio,
        fecha_publicacion: req.body.fecha_publicacion,
        descripcion: req.body.descripcion,
        imagen: imagenUrl // Guarda la URL completa de la imagen
    };

    db.productos.save(producto, (err, productoGuardado) => {
        if (err) return next(err);
        res.json(productoGuardado);
    });
});

router.delete('/productos/:id', (req, res, next) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Primero, busca el producto para obtener el nombre de la imagen
    db.productos.findOne({ _id: mongojs.ObjectId(id) }, (err, producto) => {
        if (err) return next(err);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        // Eliminar el producto de la base de datos
        db.productos.remove({ _id: mongojs.ObjectId(id) }, (err, result) => {
            if (err) return next(err);

            // Eliminar la imagen del sistema de archivos
            if (producto.imagen) {
                const imagePath = `uploads/${producto.imagen}`; // Ajusta el path según tu configuración
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error al eliminar la imagen:', err);
                });
            }

            res.json(result);
        });
    });
});

// Actualizar un producto por ID
router.put('/productos/:id', upload.single('imagen'), (req, res, next) => {
    const id = req.params.id;
    const producto = req.body;
    const updateProducto = {};

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

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
    if (producto.fecha_publicacion) {
        updateProducto.fecha_publicacion = producto.fecha_publicacion;
    }
    if (producto.descripcion) {
        updateProducto.descripcion = producto.descripcion;
    }
    if (req.file) {
        updateProducto.imagen = `http://localhost:3000/uploads/${req.file.filename}`; // Guarda la URL completa si se carga una nueva imagen
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
