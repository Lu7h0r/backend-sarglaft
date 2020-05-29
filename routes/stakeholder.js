var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Stakeholder = require('../models/stakeholder');

// ==========================================
// Obtener todos los tipos de stakeholders
// ==========================================
app.get('/', (req, res, next) => {
    // Este segundo parametro en el .find() es para devolver los campos en el arreglo
    // & pues obviamente no le voy a devolver el password
    Stakeholder.find({})
        // Traigo quien creo esta entidad de stakeholder, ya sea: Cliente, Proveedor o Empleado & puede que existan algunas mas
        .populate('usuario', 'nombre email')
        .exec((err, stakeholders) => {
            if (err) {
                // Cambiamos el código del error ya que estaria fallando
                return res.status(500).json({
                    // & pues el ok en este caso nos devolveria un false
                    ok: false,
                    // personalizamos el mensaje para el error
                    mensaje: 'Error cargando Stakeholders',
                    // y finalmente mostramos algo del error
                    errors: err,
                });
            }
            // Si no sucede ningun error pues le damos el OK
            res.status(200).json({
                ok: true,
                // Como todo esta OK, simplemente retorno un arreglo con los usuarios
                stakeholders: stakeholders,
            });
        });
});
// ==========================================
// Obtener StakeHolder por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Stakeholder.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, stakeholder) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar stakeholder',
                    errors: err,
                });
            }
            if (!stakeholder) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El stakeholder con el id ' + id + 'no existe ',
                    errors: { message: 'No existe un stakeholder con ese ID ' },
                });
            }
            res.status(200).json({
                ok: true,
                stakeholder: stakeholder,
            });
        });
});
// ==========================================
// Actualizar Stakeholder
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtener id por url
    var id = req.params.id;
    var body = req.body;
    // buscamos el usuario con el id
    Stakeholder.findById(id, (err, stakeholder) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar stakeholder',
                errors: err,
            });
        }
        if (!stakeholder) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El stakeholder con el id' + id + ' No existe...',
                errors: { message: 'No existe un stakeholder con ese ID' },
            });
        }

        // Tomamos los datos a actualizar

        stakeholder.nombre = body.nombre;
        stakeholder.usuario = req.usuario._id;

        // & grabamos lo cambios

        stakeholder.save((err, stakeholderGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar stakeholder',
                    errors: err,
                });
            }

            // Si nada esta mal devolvemos el usuario actualizado
            res.status(200).json({
                ok: true,
                stakeholder: stakeholderGuardado,
            });
        });
    });
});
// ==========================================
// Crear un nuevo stakeholder
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var stakeholder = new Stakeholder({
        nombre: body.nombre,
        // aca miramos quien creeo el stakeholder
        usuario: req.usuario._id,
    });

    stakeholder.save((err, stakeholderGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear stakeholder',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            stakeholder: stakeholderGuardado,
        });
    });
});
// ============================================
//   Borrar un stakeholder por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // nos traemos el id
    var id = req.params.id;

    Stakeholder.findByIdAndRemove(id, (err, stakeholderBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar stakeholder',
                errors: err,
            });
        }
        if (!stakeholderBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un stakeholder con ese id',
                errors: { message: 'No existe un stakeholder con ese id' },
            });
        }
        res.status(200).json({
            ok: true,
            stakeholder: stakeholderBorrado,
        });
    });
});

module.exports = app;