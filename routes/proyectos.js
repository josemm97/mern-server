const express = require('express');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const router = express.Router();
const {check}= require('express-validator')
// api/proyectos/
router.post('/',
   auth,
   [
      check('nombre', 'El NOMBRE DEL PROYETCO ES OBLIGATORIO').not().isEmpty()
   ],
   proyectoController.crearProyecto
);
router.get('/',
   auth,
   proyectoController.obtenerProyectos
);
router.put('/:id',
  auth,
  [
   check('nombre', 'El NOMBRE DEL PROYETCO ES OBLIGATORIO').not().isEmpty()
  ],
  proyectoController.actualizarProyecto,
);
router.delete('/:id',
  auth,
  proyectoController.eliminarProyecto,
  );
module.exports = router;