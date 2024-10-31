// database.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Finaliza el proceso si no puede conectar
  }
};

module.exports = connectDB;