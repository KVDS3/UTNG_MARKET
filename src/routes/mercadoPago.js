const mercadopago = require('mercadopago');

// Configura las credenciales de Mercado Pago con tu access token
mercadopago.configurations.setAccessToken('TEST-7080675336840280-102102-297746c9a853051fff5b71823a7db07f-783139872');

// Crear una preferencia de pago
const crearPreferencia = (productos) => {
    let items = productos.map(producto => ({
        title: producto.nombre_producto,
        unit_price: producto.precio,
        quantity: producto.cantidad,
    }));

    let preference = {
        items: items,
        back_urls: {
            success: "http://localhost:4200/success",
            failure: "http://localhost:4200/failure",
            pending: "http://localhost:4200/pending"
        },
        auto_return: "approved",
    };

    return mercadopago.preferences.create(preference);
};

module.exports = { crearPreferencia };
