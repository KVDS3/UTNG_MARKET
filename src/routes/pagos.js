const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/utngMarket', ['pagos']); // Cambia el nombre de la colección a 'pagos'

// Obtener todos los pagos o verificar si existe un pago específico
router.get('/pagos', (req, res, next) => {
    const { id_usuario, id_carrito } = req.query; // Cambié idCarrito a id_carrito para mantener consistencia
    
    // Si se proporcionan parámetros, buscar solo esos pagos
    if (id_usuario && id_carrito) {
        db.pagos.find({ id_usuario: id_usuario, id_carrito: id_carrito }, (err, pagos) => {
            if (err) return next(err);
            res.json(pagos); // Devuelve los pagos que coincidan
        });
    } else {
        // Si no se proporcionan parámetros, devolver todos los pagos
        db.pagos.find((err, pagos) => {
            if (err) return next(err);
            res.json(pagos);
        });
    }
});

// Obtener un solo pago por ID
router.get('/pagos/:id', (req, res, next) => {
    db.pagos.findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, pago) => {
        if (err) return next(err);
        res.json(pago);
    });
});

// Agregar un nuevo pago
router.post('/pagos', (req, res, next) => {
    const { id_usuario, id_carrito, total } = req.body; // Cambié los campos a lo que necesitas

    // Validación básica
    if (!id_usuario || !id_carrito || total == null) { // Revisa si el total es null o undefined
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const nuevoPago = { id_usuario, id_carrito, total }; // Crear el nuevo objeto de pago

    // Aquí puedes agregar la lógica para verificar si el pago ya existe antes de guardarlo
    db.pagos.find({ id_usuario, id_carrito }, (err, pagos) => {
        if (err) return next(err);
        
        // Si ya existe un pago, retorna un error
        if (pagos.length > 0) {
            return res.status(409).json({ error: 'Este pago ya existe.' });
        }

        // Si no existe, guardar el nuevo pago
        db.pagos.save(nuevoPago, (err, pagoGuardado) => {
            if (err) return next(err);
            res.json(pagoGuardado);
        });
    });
});

// Eliminar un pago por ID
router.delete('/pagos/:id', (req, res, next) => {
    db.pagos.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// Actualizar un pago por ID
router.put('/pagos/:id', (req, res, next) => {
    const pago = req.body;
    const updatePago = {};

    // Solo se actualizan los campos que vienen en el cuerpo de la petición
    if (pago.id_usuario) {
        updatePago.id_usuario = pago.id_usuario;
    }
    if (pago.total != null) { // Asegúrate de que el total puede ser 0
        updatePago.total = pago.total;
    }
    if (pago.id_carrito) {
        updatePago.id_carrito = pago.id_carrito;
    }

    if (Object.keys(updatePago).length === 0) {
        return res.status(400).json({ error: 'Bad Request' });
    } else {
        db.pagos.update({ _id: mongojs.ObjectId(req.params.id) }, { $set: updatePago }, (err, result) => {
            if (err) return next(err);
            res.json(result);
        });
    }
});

module.exports = router;
