var express = require('express');
// Traemos la libreeria par encriptar las contraseñas
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
// Me traigo el modelo para poder usar todos los parametros o campos que
// defini en mi modelo
var Usuario = require('../models/usuario');

// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res, next) => {
    // Este segundo parametro en el .find() es para devolver los campos en el arreglo
    // & pues obviamente no le voy a devolver el password
    Usuario.find({}, 'nombre email role').exec((err, usuarios) => {
        if (err) {
            // Cambiamos el código del error ya que estaria fallando
            return res.status(500).json({
                // & pues el ok en este caso nos devolveria un false
                ok: false,
                // personalizamos el mensaje para el error
                mensaje: 'Error cargando Usuarios',
                // y finalmente mostramos algo del error
                errors: err,
            });
        }
        // Si no sucede ningun error pues le damos el OK
        res.status(200).json({
            ok: true,
            // Como todo esta OK, simplemente retorno un arreglo con los usuarios
            usuarios: usuarios,
        });
    });
});
// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtener id por url
    var id = req.params.id;
    var body = req.body;
    // buscamos el usuario con el id
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err,
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + ' No existe...',
                errors: { message: 'No existe un usuario con ese ID' },
            });
        }

        // Tomamos los datos a actualizar

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        // & grabamos lo cambios

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err,
                });
            }

            usuarioGuardado.password = ':)';

            // Si nada esta mal devolvemos el usuario actualizado
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
});
// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/', (req, res) => {
    // Traemos la libreria
    var body = req.body;
    // Vamos a recibir los datos de nuestro modelo con los campos que setiamos
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Encriptamos la contraseña recibida
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    // Ahora para guardar los datos que obtuvimos por medio del body-parser

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err,
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
        });
    });
});
// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // nos traemos el id
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err,
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' },
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
});

module.exports = app;