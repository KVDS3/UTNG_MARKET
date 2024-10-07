const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/utngMarket', ['usuarios']); // Cambia el nombre de la colección a 'usuarios'

// Obtener todos los usuarios
router.get('/usuarios', (req, res, next) => {
    db.usuarios.find((err, usuarios) => {
        if (err) return next(err);
        res.json(usuarios);
    });
});

// Obtener un solo usuario por ID
router.get('/usuarios/:id', (req, res, next) => {
    db.usuarios.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, usuario) => {
        if (err) return next(err);
        res.json(usuario);
    });
});

// Agregar un nuevo usuario
router.post('/usuarios', (req, res, next) => {
    const usuario = req.body;
    db.usuarios.save(usuario, (err, usuarioGuardado) => {
        if (err) return next(err);
        res.json(usuarioGuardado);
    });
});

// Eliminar un usuario por ID
router.delete('/usuarios/:id', (req, res, next) => {
    db.usuarios.remove({_id: mongojs.ObjectId(req.params.id)}, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// Actualizar un usuario por ID
router.put('/usuarios/:id', (req, res, next) => {
    const usuario = req.body;
    const updateUsuario = {};

    // Solo se actualizan los campos que vienen en el cuerpo de la petición
    if (usuario.nombre) {
        updateUsuario.nombre = usuario.nombre;
    }
    if (usuario.rol) {
        updateUsuario.rol = usuario.rol;
    }
    if (usuario.contraseña) {
        updateUsuario.contraseña = usuario.contraseña;
    }
    if (usuario.correoElectronico) {
        updateUsuario.correoElectronico = usuario.correoElectronico;
    }
    if (usuario.telefono) {
        updateUsuario.telefono = usuario.telefono;
    }
    if (usuario.direccion) {
        updateUsuario.direccion = usuario.direccion;
    }
    if (usuario.fechaRegistro) {
        updateUsuario.fechaRegistro = usuario.fechaRegistro;
    }

    if (Object.keys(updateUsuario).length === 0) {
        return res.status(400).json({ error: 'Bad Request' });
    } else {
        db.usuarios.update({_id: mongojs.ObjectId(req.params.id)}, {$set: updateUsuario}, (err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
});

module.exports = router;
