var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clienteSchema = new Schema({
    razonSocial: {
        type: String,
        required: [true, 'El campo Razon Social es	necesario'],
    },
    nit: { type: Number, required: [true, 'El campo NIT Social es	necesario'] },
    direccion: {
        type: String,
        required: [true, 'El campo dirección es necesario'],
    },
    telefono: {
        type: Number,
        required: [true, 'El campo telefono es necesario'],
    },
    ciudad: {
        type: String,
        required: [true, 'El campo ciudad es necesario'],
    },
    personaDeContacto: {
        type: String,
        required: [true, 'El persona de contacto es necesario'],
    },
    cargo: {
        type: String,
        required: false,
    },
    comercial: {
        type: String,
        required: [true, 'El campo comercial debe ser diligenciado'],
    },
    correo: {
        type: String,
        required: [true, 'El campo correo es necesario'],
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    stakeholder: {
        type: Schema.Types.ObjectId,
        ref: 'Stakeholder',
        required: [true, 'El	id	stakeholder	es un campo obligatorio '],
    },
});

module.exports = mongoose.model('Cliente', clienteSchema);