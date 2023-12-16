const {Router} = require('express');
const {check} = require('express-validator');

const { validarJWT, validarCampos } = require('../middlewares');

const {login, renovarToken} = require('../controllers/auth');

const router = Router();

router.post('/', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],login);

router.get('/', validarJWT, renovarToken);

module.exports = router;