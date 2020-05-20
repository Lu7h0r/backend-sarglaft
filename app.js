// Requires Necesarios
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializamos las variables
var app = express();

// body-parser
// si se esta enviando algo como por ejemplo una propiedad o campo
// esta pasara por el body-parser y no lo convertira en un objeto con el
// cual podremos usar o llamar esas propiedades, como en los objetos literales de JS
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CORS

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control.Allow-Methods', 'POST, GET, PUT, DETELE, OPTIONS');
    next();
});

// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/coemDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos on Port 27017: \x1b[33m', ' Online');
});

// Importar las Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var stakeholderRoutes = require('./routes/stakeholder');
var clienteRoutes = require('./routes/cliente');
var proveedorRoutes = require('./routes/proveedor');
var empleadoRoutes = require('./routes/empleado');

// Rutas
app.use('/empleado', empleadoRoutes);
app.use('/proveedor', proveedorRoutes);
app.use('/cliente', clienteRoutes);
app.use('/stakeholder', stakeholderRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Levantar Servidor Local

app.listen(3000, () => {
    console.log('Express Server on Port: 3000: \x1b[32m%s\x1b[0m', ' Online');
});