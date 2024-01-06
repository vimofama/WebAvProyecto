const {Socket} = require('socket.io');
const { comprobarJWT } = require('../helpers/generar-jwt');

const Mensajes = require('../models/mensajes');

usuarios = {};

const ultimosMensajesPublicos = () => {
  return Mensajes.find({para: {$exists: false}})
    .sort({ timestamp: -1 })
    .limit(10)
    .populate("de", "nombre")
    .exec()
    .then((mensajes) => {
      return mensajes;
    })
    .catch((err) => {
      throw new Error("Ocurrió un error al cargar los mensajes ", err);
    });
};

const socketController = async (socket = new Socket(), io) => {
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        return socket.disconnect();
    }

    socket.on('connection', () => {
        console.log('Cliente conectado');
    })

    // Agregar el usuario conectado
    usuarios[usuario.id] = usuario;
    io.emit('usuarios-activos', Object.values(usuarios));
    socket.emit('recibir-mensajes', await ultimosMensajesPublicos());

    // Conectarlo a una sala especial
    socket.join(usuario.id); // global, socket.id, usuario.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        delete usuarios[usuario.id];
        io.emit('usuarios-activos', Object.values(usuarios));
    });

    socket.on('enviar-mensaje', async ({uid, mensaje}) => {
        if(uid){
            // Mensaje privado
            const mensajeDB = new Mensajes({de: usuario.id, para: uid, mensaje});
            await mensajeDB.save();
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje});
        }else{
            const mensajeDB = new Mensajes({de: usuario.id, mensaje});
            await mensajeDB.save();
            io.emit("recibir-mensajes", await ultimosMensajesPublicos());
        }
    });

}

module.exports = {
    socketController
}