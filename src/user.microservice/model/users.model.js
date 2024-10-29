const mongoose = require('mongoose');
const { type } = require('os');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  tipoUsuario: {
    type: String,
    required: true,
    enum: ['student', 'shop'],
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    requred:true
  },
  // Campos específicos para Estudiante
  estudiante: {
    numeroControl: {
      type: String,
      required: function() { return this.tipoUsuario === 'student'; },
      match: /^[0-9]{10}$/,
    },
    universidad: {
      type: String,
      required: function() { return this.tipoUsuario === 'student'; },
    },
    areaAcademica: {
      type: String,
      required: function() { return this.tipoUsuario === 'student'; },
    },
  },
  // Campos específicos para Tienda
  tienda: {
    rfc: {
      type: String,
      required: function() { return this.tipoUsuario === 'shop'; },
      match: /^[A-Z0-9]{10}$/,
      unique: true,
    },
    giroComercial: {
      type: String,
      required: function() { return this.tipoUsuario === 'shop'; },
    },
    representanteLegal: {
      type: String,
      required: function() { return this.tipoUsuario === 'shop'; },
    },
  },
}, { timestamps: true });

// Ajuste para definir un índice único en el RFC cuando el tipo de usuario es 'shop'
usuarioSchema.index({ 'tienda.rfc': 1 }, { unique: true, partialFilterExpression: { tipoUsuario: 'shop' } });

module.exports = mongoose.model('Usuario', usuarioSchema);
