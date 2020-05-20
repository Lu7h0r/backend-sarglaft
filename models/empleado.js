var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seteamos los documentos validos
var documentosValidos = {
    values: ['CC', 'CE'],
    message: '{VALUE} no es un documento permitido',
};

var empleadoSchema = new Schema({
    primerApellido: {
        type: String,
        required: [true, 'El campo primer apellido es	necesario'],
    },
    tipoDeEmpleado: {
        type: String,
        required: [true, 'El campo tipo de empleado es	necesario'],
    },
    segundoApellido: {
        type: String,
        required: [true, 'El campo segundo apellido es necesario'],
    },
    telefono: {
        type: Number,
        required: [true, 'El campo telefono es necesario'],
    },
    nombres: {
        type: String,
        required: [true, 'El campo nombres debe ser diligenciado'],
    },
    correo: {
        type: String,
        required: [true, 'El campo correo es necesario'],
    },
    tipoDeDocumento: {
        type: String,
        required: [true, 'Debe seleccionar un tipo de documento'],
        enum: documentosValidos,
    },
    numeroDocumento: {
        type: Number,
        required: [true, 'El # de documento debe ser diligenciado'],
    },
    direccion: {
        type: String,
        required: [true, 'Debe especificar una dirección'],
    },
    usuarioSolicitud: {
        type: String,
        required: [true, 'Debe indicar el nombre de quien solicita'],
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    stakeholder: {
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder',
        required: [true, 'El	id	stakeholder	es un campo obligatorio '],
    },
});

module.exports = mongoose.model('Empleado', empleadoSchema);