const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const {check} = require('express-validator');
const auth = require('../middleware/auth')
// crea un usurio
// api/usuarios
router.post('/', 
   auth,
   [
       check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
       check('proyecto', 'EL NOMBRE DEL PROYECTO ES OBLIGATORIO').not().isEmpty(),
   ],
   tareaController.crearTarea
   );

// Obtener tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);
// actualizar tareas por proyecto
router.put('/:id',
     auth,
     tareaController.actualizarTarea
)

// ELIMINAR TAREA POR PORYECTO
router.delete('/:id',
     auth,
     tareaController.eliminarTarea,
)
module.exports = router;
