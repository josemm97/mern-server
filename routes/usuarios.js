// RUtas para crear un usuario
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');

// crea un usurio
// api/usuarios
router.post('/', 
   [
       check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
       check('email', 'INGRESA UN EMAIL VALIDO').isEmail(),
       check('password','EL PASSWORD DEBERIA DE SER DE MINIMO 6 CARACTERES').isLength({min: 6})
   ],
   usuarioController.crearUsuario
   );

module.exports = router;