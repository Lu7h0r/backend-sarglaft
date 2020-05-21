var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Stakeholder = require('../models/stakeholder');
var Cliente = require('../models/cliente');
var Empleado = require('../models/empleado');
var Proveedor = require('../models/proveedor');
var Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colecion

    var tiposValidos = [
        'stakeholders',
        'clientes',
        'proveedores',
        'empleados',
        'usuarios',
    ];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'El tipo de colección no es valida' },
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado un archivo',
            errors: { message: 'Debe seleccionar un archivo para adjuntar' },
        });
    }

    // obtener tipo de archivo

    var archivo = req.files.imagen;
    var splitExtension = archivo.name.split('.');
    var extensionArchivo = splitExtension[splitExtension.length - 1];

    // Aceptamoos el tipo de extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: {
                message: 'Las extensiones validas son:' + extensionesValidas.join(', '),
            },
        });
    }

    // renombrar los archivos para no pisarlos en caso de que sean iguales

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo al path desde el temporal

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover adjunto',
                errors: err,
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo subido correctamente',
        //     splitExtension: extensionArchivo,
        // });
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'stakeholders') {
        Stakeholder.findById(id, (err, stakeholder) => {
            if (!stakeholder) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Stakeholder no existe',
                    errors: { message: 'Stakeholder no existe' },
                });
            }
            var pathViejo = './uploads/stakeholders' + stakeholder.img;
            // verificamos si existe ya algo subido por el usuario para removerlo
            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            stakeholder.img = nombreArchivo;
            stakeholder.save((err, stakeholderActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Stakeholder Actualizada correctamente',
                    stakeholder: stakeholderActualizado,
                });
            });
        });
    }
}

module.exports = app;