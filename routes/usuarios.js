const {Router} = require('express');
const {check} = require('express-validator');

const { validarCampos, validarAdminJWT } = require('../middlewares');

const {existeUsuarioPorId} = require('../helpers/db-validators');

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuarioGetByCorreo
} = require("../controllers/usuarios");

const router = Router();

router.get('/', usuariosGet);

router.get("/:correo", [
    check("correo", "El correo no es válido").isEmail(),
     validarCampos
], usuarioGetByCorreo);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], usuariosPost);

router.put("/:id", [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
], usuariosPut);

router.delete('/:id', [
    validarAdminJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;