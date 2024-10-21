const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

//const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');


// configuracion
const PORT = 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
// Midd
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// router
//app.use(indexRoutes);
app.use('/api', usuariosRoutes),
app.use('/api', productosRoutes),
app.use('/api', carritoRoutes),



// start server
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});