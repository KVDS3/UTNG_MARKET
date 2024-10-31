// Configuración de Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otro servicio de correo
    auth: {
        user: 'juan02050206@gmail.com', // Cambia a tu correo electrónico
        pass: 'nekf uaxw yxgb diec' // Cambia a tu contraseña
    }
});
// Función global para enviar correos con estructura HTML
function enviarCorreoPedido(destinatario, producto) {
    const mailOptions = {
        from: 'juan02050206@gmail.com', // Cambia a tu correo electrónico
        to: destinatario, // El correo que recibirá las notificaciones
        subject: 'Nuevo Pedido de Producto',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Nuevo Pedido de Producto</h2>
    
    <p style="color: #555;">Se ha solicitado el siguiente producto:</p>

    <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <ul style="list-style-type: none; padding: 0; color: #333;">
            <li style="margin-bottom: 8px;">
                <strong>Nombre del producto:</strong> <span style="color: #007BFF;">${producto.nombre_producto}</span>
            </li>
            <li style="margin-bottom: 8px;">
                <strong>ID del producto:</strong> <span style="color: #007BFF;">${producto.id}</span>
            </li>
            <li style="margin-bottom: 8px;">
                <strong>Cantidad disponible:</strong> <span style="color: #28A745;">${producto.cantidad_dispo}</span>
            </li>
            <li style="margin-bottom: 8px;">
                <strong>Precio:</strong> <span style="color: #DC3545;">$${producto.precio}</span>
            </li>
        </ul>
    </div>

    <p style="color: #555; margin-top: 15px; text-align: center;">Por favor, revisa los detalles y confirma el pedido.</p>
</div>

        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
            throw new Error('Error al enviar el correo'); // Lanza el error para manejarlo en las rutas
        }
        console.log('Correo enviado: ' + info.response);
    });
}
module.exports = enviarCorreoPedido;
