// rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController')
const auth =  require('../middleware/auth')

router.post('/',
    // [
    //     // check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
    //     check('email', 'INGRESA UN EMAIL VALIDO').isEmail(),
    //     check('password','EL PASSWORD DEBERIA DE SER DE MINIMO 6 CARACTERES').isLength({min: 6})
    // ],
  authController.autenticarUsuario
);
// obtener usuario autenticado
router.get('/',
    auth,
    authController.obtenerUsuario
);
module.exports = router;