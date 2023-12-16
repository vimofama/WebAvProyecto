const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const {generarJWT} = require('../helpers/generar-jwt');

const login = async(req, res) => {
    const {correo, password} = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const renovarToken = async(req, res) => {
    const {usuario} = req;

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    renovarToken
}