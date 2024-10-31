const express = require('express');
const connectDB = require('./db.js');
const usuarioController = require('./controller/users.controller');
const morgan= require('morgan');
const cors = require('cors');
require('dotenv').config();
const enviarCorreoPedido = require('./controller/functions.test.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
connectDB();

// Suponiendo que el producto es este objeto
const producto = {
  id: '1234567890abcdef12345678',
  nombre_producto: 'Producto de ejemplo',
  cantidad_dispo: 10,
  precio: 100
};

// Llamada a la función para enviar el correo
enviarCorreoPedido('4181180400d@gmail.com', producto);


// Rutas de Usuario
app.post('/usuarios', usuarioController.registrarUsuario); // Crear usuario
// app.get('/usuarios', usuarioController.getUsers); // Obtener todos los usuarios
// app.get('/usuarios/:id', usuarioController.getUserById); // Obtener usuario por ID
// app.put('/usuarios/:id', usuarioController.updateUser); // Actualizar usuario por ID
// app.delete('/usuarios/:id', usuarioController.deleteUser); // Eliminar usuario por ID
app.post('/usuarios/login', usuarioController.loginUser); // Login de usuario
app.get('/rfc/:rfc',usuarioController.getRFC)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
