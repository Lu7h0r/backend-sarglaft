var express = require('express');
var app = express();

var Cliente = require('../models/cliente');
var Proveedor = require('../models/proveedor');
var Empleado = require('../models/empleado');
var Usuario = require('../models/usuario');
// ==============================
// Busqueda por colección
// ==============================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;
        case 'proveedores':
            promesa = buscarProveedores(busqueda, regex);
            break;
        case 'empleados':
            promesa = buscarEmpleados(busqueda, regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busquedad solo son: Clientes, Proveedores, Empleados & Usuarios',
                error: { message: 'Tipo de colección o tabla no valida' },
            });
    }
    promesa.then((data) => {
        res.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });
});

// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarClientes(busqueda, regex),
        buscarProveedores(busqueda, regex),
        buscarEmpleados(busqueda, regex),
        buscarUsuarios(busqueda, regex),
    ]).then((respuestas) => {
        res.status(200).json({
            ok: true,
            clientes: respuestas[0],
            proveedores: respuestas[1],
            empleados: respuestas[2],
            usuarios: respuestas[3],
        });
    });
});

function buscarClientes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Cliente.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('stakeholder', 'nombre')
            .exec((err, clientes) => {
                if (err) {
                    reject('Error al cargar clientes', err);
                } else {
                    resolve(clientes);
                }
            });
    });
}

function buscarProveedores(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Proveedor.find({ nombre: regex }, (err, proveedores) => {
            if (err) {
                reject('Error al cargar proveedores', err);
            } else {
                resolve(proveedores);
            }
        });
    });
}

function buscarEmpleados(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Empleado.find({ nombre: regex }, (err, empleados) => {
            if (err) {
                reject('Error al cargar empleados', err);
            } else {
                resolve(empleados);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find()
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;