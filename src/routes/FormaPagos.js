const express = require('express');
const router = express.Router();

// Ruta para crear la preferencia de pago
router.post('/preferencia', async (req, res) => {
    try {
        const productos = req.body.productos; // Ahora está bien usar req.body
        const preference = await crearPreferencia(productos);
        res.json({ preferenceId: preference.body.id });
    } catch (error) {
        res.status(500).send({ error: 'Error al crear la preferencia' });
    }
});

module.exports = router;
