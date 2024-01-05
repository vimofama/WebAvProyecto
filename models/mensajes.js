const {Schema, model} = require('mongoose');

const MensajeSchema = Schema({
    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El campo de es obligatorio']
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    mensaje: {
        type: String,
        required: [true, 'El campo mensaje es obligatorio']
    },
    timestap: {
        type: Date,
        default: Date.now
    }
});

MensajeSchema.methods.toJSON = function(){
    const {__v, _id, ...mensaje} = this.toObject();
    mensaje.id = _id;
    return mensaje;
}

module.exports = model('Mensaje', MensajeSchema);