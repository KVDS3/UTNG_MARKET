const express = require('express');
const connectDB = require('./db.js');
const usuarioController = require('./controller/users.controller');
const morgan= require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
connectDB();

// Rutas de Usuario
app.post('/usuarios', usuarioController.registrarUsuario); // Crear usuario
// app.get('/usuarios', usuarioController.getUsers); // Obtener todos los usuarios
// app.get('/usuarios/:id', usuarioController.getUserById); // Obtener usuario por ID
// app.put('/usuarios/:id', usuarioController.updateUser); // Actualizar usuario por ID
// app.delete('/usuarios/:id', usuarioController.deleteUser); // Eliminar usuario por ID
app.post('/usuarios/login', usuarioController.loginUser); // Login de usuario

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
