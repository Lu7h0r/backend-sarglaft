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

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    );
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
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var archivosRoutes = require('./routes/archivos');
var soapRoutes = require('./routes/soap');

// Rutas
app.use('/soap', soapRoutes);
app.use('/archivos', archivosRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
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