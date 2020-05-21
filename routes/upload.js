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
    // Tipo es a donde queremos mandar los archivos, pueden ser los stakeholders o usuarios
    var tipo = req.params.tipo;
    // & el id pues para asignarselo
    var id = req.params.id;

    // tipos de colecion donde se podran asignar los archivos subidos

    var tiposValidos = [
        'stakeholders',
        'clientes',
        'proveedores',
        'empleados',
        'usuarios',
    ];
    // Validamos que lo que nos manden sea lpo que queremos
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'El tipo de colección no es valida' },
        });
    }
    // comprobamos que nos manden algo o que no este vacio
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado un archivo',
            errors: { message: 'Debe seleccionar un archivo para adjuntar' },
        });
    }

    // obtener tipo de archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Aceptamoos el tipo de extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];

    // alidamos que nos envien los tipos de extensiones que asignamos

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {
                message: 'Las extensiones válidas son:' + extensionesValidas.join(', '),
            },
        });
    }

    // renombrar los archivos para no pisarlos en caso de que sean iguales

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo al path desde el temporal

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover adjunto',
                errors: err,
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo subido correctamente',
        //     nombreCortado: extensionArchivo,
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
    if (tipo === 'clientes') {
        Cliente.findById(id, (err, cliente) => {
            if (!cliente) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Cliente no existe',
                    errors: { message: 'Cliente no existe' },
                });
            }
            var pathViejo = './uploads/clientes' + cliente.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            cliente.img = nombreArchivo;
            cliente.save((err, clienteActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de cliente Actualizada correctamente',
                    cliente: clienteActualizado,
                });
            });
        });
    }
    if (tipo === 'empleados') {
        Empleado.findById(id, (err, empleado) => {
            if (!empleado) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Empleado no existe',
                    errors: { message: 'Empleado no existe' },
                });
            }
            var pathViejo = './uploads/empleados' + empleado.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            empleado.img = nombreArchivo;
            empleado.save((err, empleadoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de empleado Actualizada correctamente',
                    empleado: empleadoActualizado,
                });
            });
        });
    }
    if (tipo === 'proveedores') {
        Proveedor.findById(id, (err, proveedor) => {
            if (!proveedor) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Proveedor no existe',
                    errors: { message: 'Proveedor no existe' },
                });
            }
            var pathViejo = './uploads/proveedores' + proveedor.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            proveedor.img = nombreArchivo;
            proveedor.save((err, proveedorActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de proveedor Actualizada correctamente',
                    proveedor: proveedorActualizado,
                });
            });
        });
    }
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' },
                });
            }
            var pathViejo = './uploads/usuarios' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada correctamente',
                    usuario: usuarioActualizado,
                });
            });
        });
    }
}

module.exports = app;