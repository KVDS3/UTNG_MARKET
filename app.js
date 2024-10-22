const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombrar el archivo con un timestamp
  }
});

const upload = multer({ storage: storage });

app.post('/api/productos', upload.single('imagen'), (req, res) => {
  const producto = {
    id_vendedor: req.body.id_vendedor,
    nombre_producto: req.body.nombre_producto,
    cantidad_dispo: req.body.cantidad_dispo,
    categoria: req.body.categoria,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    imagen_url: req.file ? `/uploads/${req.file.filename}` : null // Asegúrate de que req.file esté definido
  };

  console.log(`Imagen guardada en: ${producto.imagen_url}`); // Verifica que se genere la URL
  // Aquí agregar lógica para guardar el producto en la base de datos
  res.json(producto); // Responde con el producto
});
