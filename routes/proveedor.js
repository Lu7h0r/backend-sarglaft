var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Proveedor = require('../models/proveedor');

// ==========================================
// Obtener todos los proveedores
// ==========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Proveedor.find({})
        .skip(desde)
        .limit(5)
        // Traigo datos de quien creo este stakeholders
        .populate('usuario', 'nombre email')
        // & me traigo el stakeholder al que pertenece: Cliente, Proveedor, Empleado
        .populate('stakeholder', 'nombre')
        .exec((err, proveedores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Proveedores',
                    errors: err,
                });
            }
            // Contamos la cantidad de usuarios registrados desde la DB
            Proveedor.count({}, (err, conteo) => {
                // Si no sucede ningun error pues le damos el OK
                res.status(200).json({
                    ok: true,
                    // Como todo esta OK, simplemente retorno un arreglo con los usuarios
                    proveedores: proveedores,
                    total: conteo,
                });
            });
        });
});
// ==========================================
// Actualizar Proveedor
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtener id por url
    var id = req.params.id;
    var body = req.body;
    // buscamos el proveedor con el id
    Proveedor.findById(id, (err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proveedor',
                errors: err,
            });
        }
        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proveedor con el id' + id + ' No existe...',
                errors: { message: 'No existe un proveedor con ese ID' },
            });
        }

        // Tomamos los datos a actualizar
        proveedor.razonSocial = body.razonSocial;
        proveedor.nit = body.nit;
        proveedor.direccion = body.direccion;
        proveedor.ciudad = body.ciudad;
        proveedor.telefono = body.telefono;
        proveedor.personaDeContacto = body.personaDeContacto;
        proveedor.cargo = body.cargo;
        proveedor.correo = body.correo;
        proveedor.adjunto = body.adjunto;
        proveedor.usuarioSolicitud = body.usuarioSolicitud;
        proveedor.usuario = body.usuario._id;
        proveedor.stakeholder = body.stakeholder;

        // & grabamos lo cambios

        proveedor.save((err, proveedorGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar proveedor',
                    errors: err,
                });
            }

            // Si nada esta mal devolvemos el proveedor actualizado
            res.status(200).json({
                ok: true,
                proveedor: proveedorGuardado,
            });
        });
    });
});
// ==========================================
// Crear un nuevo proveedor
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var proveedor = new Proveedor({
        razonSocial: body.razonSocial,
        nit: body.nit,
        direccion: body.direccion,
        ciudad: body.ciudad,
        telefono: body.telefono,
        personaDeContacto: body.personaDeContacto,
        cargo: body.cargo,
        correo: body.correo,
        adjunto: body.adjunto,
        usuarioSolicitud: body.usuarioSolicitud,
        usuario: req.usuario._id,
        stakeholder: body.stakeholder,
    });

    proveedor.save((err, proveedorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear proveedor',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            proveedor: proveedorGuardado,
        });
    });
});
// ============================================
//   Borrar un proveedor por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // nos traemos el id
    var id = req.params.id;

    Proveedor.findByIdAndRemove(id, (err, proveedorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar proveedor',
                errors: err,
            });
        }
        if (!proveedorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un proveedor con ese id',
                errors: { message: 'No existe un proveedor con ese id' },
            });
        }
        res.status(200).json({
            ok: true,
            proveedor: proveedorBorrado,
        });
    });
});

module.exports = app;