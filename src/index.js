const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

//const indexRoutes = require('./routes/index');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('../routes/productos');


// configuracion
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Midd
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// router
//app.use(indexRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', productosRoutes);

//Statics files
app.use(express.static(path.join(__dirname, 'dist')));

// start server
app.listen(3000, () => {
    console.log('Server on port', app.get('port'));
});