const Usuario = require('../models/usuario');

const existeUsuarioPorId = async (id) => {
  const existeEmail = await Usuario.findById(id);
  if (!existeEmail) {
    throw new Error(`El id no existe: ${id}`);
  }
}

module.exports = {
  existeUsuarioPorId
}