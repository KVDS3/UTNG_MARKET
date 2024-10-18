const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Ruta absoluta donde se guardarán los archivos
const uploadDir = path.join(__dirname, 'uploads');

// Verificar si la carpeta de uploads existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar almacenamiento de archivos con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Usa la ruta de uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Almacena solo el nombre del archivo
  }
});

const upload = multer({ storage: storage });

// Middleware para poder leer los datos JSON en las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/productos', upload.single('imagen'), (req, res) => {
  const imagenUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null; // Generar la URL completa de la imagen
  
  const productoData = {
    id_vendedor: req.body.id_vendedor,
    nombre_producto: req.body.nombre_producto,
    cantidad_dispo: req.body.cantidad_dispo,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    fecha_publicacion: new Date(),
    categoria: req.body.categoria,
    imagen: imagenUrl // Guardar la URL de la imagen
  };

  // Aquí deberías guardar `productoData` en la base de datos (ej. MongoDB)
  // Ejemplo: await Product.create(productoData);

  res.status(200).json({ mensaje: 'Producto creado exitosamente', productoData });
});

// Middleware para servir archivos estáticos (como imágenes subidas)
app.use('/uploads', express.static(uploadDir));


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
