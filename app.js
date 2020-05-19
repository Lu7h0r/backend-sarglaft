// Requires Necesarios
var express = require('express');
var mongoose = require('mongoose');

// Inicializamos las variables
var app = express();

// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/coemDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos on Port 27017: \x1b[33m', ' Online');
});

// Rutas del Backend
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición Realizada correctamente',
    });
});

// Levantar Servidor Local

app.listen(3000, () => {
    console.log('Express Server on Port: 3000: \x1b[32m%s\x1b[0m', ' Online');
});