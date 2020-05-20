var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stakeholderSchema = new Schema({
    nombre: { type: String, required: [true, 'Debe asignarle un nombre'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
}, { collection: 'stakeholders' });
module.exports = mongoose.model('stakeholder', stakeholderSchema);