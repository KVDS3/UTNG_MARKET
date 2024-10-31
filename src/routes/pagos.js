const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/UTNGMARKET', ['pagos']); // Cambia el nombre de la colección a 'pagos'

// Obtener todos los pagos o verificar si existe un pago específico
router.get('/pagos', (req, res, next) => {
    const { id_usuario, id_carrito } = req.query;
    
    if (id_usuario && id_carrito) {
        db.pagos.find({ id_usuario, id_carrito }, (err, pagos) => {
            if (err) return next(err);
            res.json(pagos);
        });
    } else {
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
    const { id_usuario, id_carrito, total } = req.body;

    if (!id_usuario || !id_carrito || total == null) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const nuevoPago = { id_usuario, id_carrito, total };

    db.pagos.find({ id_usuario, id_carrito }, (err, pagos) => {
        if (err) return next(err);
        
        if (pagos.length > 0) {
            return res.status(409).json({ error: 'Este pago ya existe.' });
        }

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
router.put('/pagos/:id', (req, res) => {
    const id = req.params.id; // Obtiene el ID del pago a actualizar de los parámetros de la URL
    const { total } = req.body; // Extrae el nuevo total del cuerpo de la solicitud

    db.pagos.findAndModify({
        query: { _id: mongojs.ObjectId(id) }, // Busca el pago por ID
        update: { $set: { total } }, // Actualiza el campo total con el nuevo valor
        new: true // Devuelve el documento actualizado
    }, (err, pagoActualizado) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el pago' }); // Manejo de errores
        res.json(pagoActualizado); // Devuelve el pago actualizado como respuesta
    });
});

module.exports = router;
