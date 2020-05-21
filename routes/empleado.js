var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Empleado = require('../models/empleado');

// ==========================================
// Obtener todos los empleados
// ==========================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Empleado.find({})
        .skip(desde)
        .limit(5)
        // Traigo datos de quien creo este stakeholders
        .populate('usuario', 'nombre email')
        // & me traigo el stakeholder al que pertenece: Cliente, Proveedor, Empleado
        .populate('stakeholder', 'nombre')
        .exec((err, empleados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Empleados',
                    errors: err,
                });
            }
            // Contamos la cantidad de usuarios registrados desde la DB
            Empleado.count({}, (err, conteo) => {
                // Si no sucede ningun error pues le damos el OK
                res.status(200).json({
                    ok: true,
                    // Como todo esta OK, simplemente retorno un arreglo con los usuarios
                    empleados: empleados,
                    total: conteo,
                });
            });
        });
});
// ==========================================
// Actualizar Empleado
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtener id por url
    var id = req.params.id;
    var body = req.body;
    // buscamos el empleado con el id
    Empleado.findById(id, (err, empleado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empleado',
                errors: err,
            });
        }
        if (!empleado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El empleado con el id' + id + ' No existe...',
                errors: { message: 'No existe un empleado con ese ID' },
            });
        }

        // Tomamos los datos a actualizar
        empleado.primerApellido = body.primerApellido;
        empleado.tipoDeEmpleado = body.tipoDeEmpleado;
        empleado.segundoApellido = body.segundoApellido;
        empleado.telefono = body.telefono;
        empleado.nombres = body.nombres;
        empleado.correo = body.correo;
        empleado.tipoDeDocumento = body.tipoDeDocumento;
        empleado.numeroDocumento = body.numeroDocumento;
        empleado.direccion = body.direccion;
        empleado.usuarioSolicitud = body.usuarioSolicitud;
        empleado.usuario = body.usuario._id;
        empleado.stakeholder = body.stakeholder;

        // & grabamos lo cambios

        empleado.save((err, empleadoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar empleado',
                    errors: err,
                });
            }

            // Si nada esta mal devolvemos el empleado actualizado
            res.status(200).json({
                ok: true,
                empleado: empleadoGuardado,
            });
        });
    });
});
// ==========================================
// Crear un nuevo empleado
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var empleado = new Empleado({
        primerApellido: body.primerApellido,
        tipoDeEmpleado: body.tipoDeEmpleado,
        segundoApellido: body.segundoApellido,
        telefono: body.telefono,
        nombres: body.nombres,
        correo: body.correo,
        tipoDeDocumento: body.tipoDeDocumento,
        numeroDocumento: body.numeroDocumento,
        direccion: body.direccion,
        usuarioSolicitud: body.usuarioSolicitud,
        usuario: req.usuario._id,
        stakeholder: body.stakeholder,
    });

    empleado.save((err, empleadoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear empleado',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            empleado: empleadoGuardado,
        });
    });
});
// ============================================
//   Borrar un empleado por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // nos traemos el id
    var id = req.params.id;

    Empleado.findByIdAndRemove(id, (err, empleadoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar empleado',
                errors: err,
            });
        }
        if (!empleadoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un empleado con ese id',
                errors: { message: 'No existe un empleado con ese id' },
            });
        }
        res.status(200).json({
            ok: true,
            empleado: empleadoBorrado,
        });
    });
});

module.exports = app;