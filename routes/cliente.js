var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Cliente = require('../models/cliente');

// ==========================================
// Obtener todos los clientes
// ==========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Cliente.find({})
        .skip(desde)
        // paginamos a 5 los resultados
        .limit(5)
        // Traigo datos de quien creo este stakeholders
        .populate('usuario', 'nombre email')
        // & me traigo el stakeholder al que pertenece: Cliente, Proveedor, Empleado
        .populate('stakeholder', 'nombre')
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Clientes',
                    errors: err,
                });
            }
            // Contamos la cantidad de usuarios registrados desde la DB
            Cliente.count({}, (err, conteo) => {
                // Si no sucede ningun error pues le damos el OK
                res.status(200).json({
                    ok: true,
                    // Como todo esta OK, simplemente retorno un arreglo con los usuarios
                    clientes: clientes,
                    total: conteo,
                });
            });
        });
});

// ==========================================
// Actualizar Cliente
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtener id por url
    var id = req.params.id;
    var body = req.body;
    // buscamos el cliente con el id
    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err,
            });
        }
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id' + id + ' No existe...',
                errors: { message: 'No existe un cliente con ese ID' },
            });
        }

        // Tomamos los datos a actualizar

        cliente.razonSocial = body.razonSocial;
        cliente.nit = body.nit;
        cliente.direccion = body.direccion;
        cliente.telefono = body.telefono;
        cliente.ciudad = body.ciudad;
        cliente.personaDeContacto = body.personaDeContacto;
        cliente.cargo = body.cargo;
        cliente.comercial = body.comercial;
        cliente.correo = body.correo;
        cliente.usuario = body.usuario._id;
        cliente.stakeholder = body.stakeholder;

        // & grabamos lo cambios

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err,
                });
            }

            // Si nada esta mal devolvemos el cliente actualizado
            res.status(200).json({
                ok: true,
                cliente: clienteGuardado,
            });
        });
    });
});
// ==========================================
// Crear un nuevo cliente
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var cliente = new Cliente({
        razonSocial: body.razonSocial,
        nit: body.nit,
        direccion: body.direccion,
        telefono: body.telefono,
        ciudad: body.ciudad,
        personaDeContacto: body.personaDeContacto,
        cargo: body.cargo,
        comercial: body.comercial,
        correo: body.correo,
        usuario: req.usuario._id,
        stakeholder: body.stakeholder,
    });

    cliente.save((err, clienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            cliente: clienteGuardado,
        });
    });
});
// ============================================
//   Borrar un cliente por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // nos traemos el id
    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar cliente',
                errors: err,
            });
        }
        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese id',
                errors: { message: 'No existe un cliente con ese id' },
            });
        }
        res.status(200).json({
            ok: true,
            cliente: clienteBorrado,
        });
    });
});

module.exports = app;