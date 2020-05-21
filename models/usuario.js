var mongoose = require('mongoose');
// Importamos la libreria de validaciones
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// Asignamos los unicos roles validos que podremmos ingresar, para evitar
// que hagan lo que se les de la gana
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido',
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: { type: String, required: [true, 'la contrsaseña es necesaria'] },
    img: { type: String, required: false },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        // & aca simplemente lo asignamos con enum:
        enum: rolesValidos,
    },
});
// Implementamos las validaciones
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser diferente' });
// Exportamos el modelo y lo pasamos para porerlo usar
module.exports = mongoose.model('Usuario', usuarioSchema);