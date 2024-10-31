const express = require('express');
const mongojs = require('mongojs');
const multer = require('multer');
const path = require('path');

// Habilitar CORS para todas las rutas

const fs = require('fs'); // Importar el módulo fs para manejar archivos

const router = express.Router();
const db = mongojs('127.0.0.1/UTNGMARKET', ['productos']);

// Configuración de multer para guardar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

const upload = multer({ storage: storage });

// Crear un nuevo producto con imagen
router.post('/productos', upload.single('imagen'), (req, res, next) => {
    const producto = {
        id_vendedor: req.body.id_vendedor,
        nombre_producto: req.body.nombre_producto,
        cantidad_dispo: req.body.cantidad_dispo,
        categoria: req.body.categoria,
        precio: req.body.precio,
        fecha_publicacion: req.body.fecha_publicacion,
        descripcion: req.body.descripcion,
        imagen_url: req.file ? `/uploads/${req.file.filename}` : null // Guardar la ruta de la imagen
    };

    console.log(`Imagen guardada en: ${producto.imagen_url}`); // Verifica la ruta

    db.productos.save(producto, (err, productoGuardado) => {
        if (err) return next(err);
        res.json(productoGuardado);
    });
});

// Obtener todos los productos
router.get('/productos', (req, res, next) => {
    db.productos.find((err, productos) => {
        if (err) return next(err);
        res.json(productos);
    });
});

// Obtener un producto por ID
router.get('/productos/:id', (req, res, next) => {
    const id = req.params.id;
    if (!mongojs.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    db.productos.findOne({ _id: mongojs.ObjectId(id) }, (err, producto) => {
        if (err) return next(err);
        res.json(producto);
    });
});

// Eliminar un producto por ID
router.delete('/productos/:id', (req, res, next) => {
    const id = req.params.id;
    if (!mongojs.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Buscar el producto antes de eliminarlo para obtener la imagen_url
    db.productos.findOne({ _id: mongojs.ObjectId(id) }, (err, producto) => {
        if (err) return next(err);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        // Eliminar el producto de la base de datos
        db.productos.remove({ _id: mongojs.ObjectId(id) }, (err, result) => {
            if (err) return next(err);

            // Si el producto tiene una imagen asociada, eliminar el archivo
            if (producto.imagen_url) {
                const imagePath = path.join('uploads', path.basename(producto.imagen_url));
                
                // Comprobar si el archivo existe antes de intentar eliminarlo
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error al eliminar la imagen:', err);
                    } else {
                        console.log('Imagen eliminada correctamente');
                    }
                });
            }

            res.json(result);
        });
    });
});

// Actualizar un producto por ID
router.put('/productos/:id', upload.single('imagen'), (req, res, next) => {
    const id = req.params.id;
    const updateProducto = {};

    if (!mongojs.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Solo actualiza si se reciben nuevos datos
    if (req.body.nombre_producto) {
        updateProducto.nombre_producto = req.body.nombre_producto;
    }
    if (req.body.cantidad_dispo) {
        updateProducto.cantidad_dispo = req.body.cantidad_dispo;
    }
    if (req.body.categoria) {
        updateProducto.categoria = req.body.categoria;
    }
    if (req.body.precio) {
        updateProducto.precio = req.body.precio;
    }
    if (req.body.fecha_publicacion) {
        updateProducto.fecha_publicacion = req.body.fecha_publicacion;
    }
    if (req.body.descripcion) {
        updateProducto.descripcion = req.body.descripcion;
    }
    if (req.file) {
        updateProducto.imagen_url = `/uploads/${req.file.filename}`; // Actualiza la imagen si se envía una nueva
    }

    if (Object.keys(updateProducto).length === 0) {
        return res.status(400).json({ error: 'Bad Request: No fields to update' });
    }

    db.productos.update(
        { _id: mongojs.ObjectId(id) },
        { $set: updateProducto },
        (err, result) => {
            if (err) return next(err);
            console.log('Producto actualizado:', result);
            res.json(result);
        }
    );
});



module.exports = router;
