const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res) => {
    const usuarios = await Usuario.find();
    res.json({
        usuarios
    });
};

const usuarioGetByCorreo = async(req, res) => {
    const {correo} = req.params;

    const usuario = await Usuario.findOne({correo});

    if (!usuario) {
        return res.status(400).json({
            msg: `El correo ${correo} no está registrado`
        });
    }

    res.status(200).json({
        usuario
    });
}

const usuariosPost = async(req, res) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    try {
        // Guardar en BD
        await usuario.save();
        res.json({
            usuario
        });

    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                msg: `El correo ${correo} ya está registrado`
            });
        } else {
            res.status(500).json({
                msg: 'Hable con el administrador',
                error
            });
        }
    }

};

const usuariosPut = async(req, res) => {
    const {id} = req.params;
    const {_id, password, correo, ...resto} = req.body;

    if(password){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(200).json(usuario);
};

const usuariosDelete = async(req, res) => {
    const {id} = req.params;

    // Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);

};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuarioGetByCorreo,
};