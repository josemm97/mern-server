const Proyecto = require('../models/proyecto.model');
const Tarea = require('../models/tarea.model');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res)=>{
      // validamos
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
          return res.status(400).json({msg: errores.errors[0]})
      }
      // extraemos proyecto
      const {proyecto} = req.body;

     try {
        const documentProyecto =  await Proyecto.findById(proyecto)
        if(!documentProyecto){
           return res.status(404).json({msg: "Proyecto no existe"})
        }
        //Revisar si el proyecto actual pertence al usuario autenticado
        if (documentProyecto.creador.toString() !== req.user.id ) {
           return res.status(401).json({msg: "Acceso no autorizado"}) 
        }
        //creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({msg: "Tarea creada exitosamente", tarea})
     } catch (error) {
         res.status(500).json({error: "Error en el servidor"})
         console.log(error)
     }
};

// obtener Tareas por proyecto
exports.obtenerTareas = async (req ,res)=>{
   // extraemos el id del proyecto
   const { proyecto } = req.query;
   console.log('proyecto',proyecto);
   try {
      const existeProyecto = await Proyecto.findById(proyecto)
      // CONDICIONAMOS SI EXISTE
      if (!existeProyecto) {
         return res.status(404).json({msg: "PROYECTO NO ENCONTRADO"})
      }
      // Condicionamos si el creador pertenece al usuario 
      if(existeProyecto.creador.toString() !== req.user.id){
         return res.status(404).json({msg: "ACCESO NO AUTORIZADO"})
      }
     // OBTENEMOS TAREAS 
     const tareas = await Tarea.find({proyecto}).sort({creado:-1});

     res.json({tareas})
   } catch (error) {
      res.status(500).json({error: "Hubo un error en el servidor"})
      console.log(error)
   }
}

exports.actualizarTarea = async (req,res) =>{
   // extraemos el id del proyecto para ver si existe
   const {proyecto, nombre, estado}= req.body
   

   try {
   let tarea = await Tarea.findById(req.params.id);
    console.log('tarea',tarea);
    // si la tarea existe
    if(!tarea){
       req.status(401).json({"Tarea": "Tarea no existente"})
    }
    // si existe el proyecto
    const existeProyecto = await Proyecto.findById(proyecto)
    // si el proyecto pertenece al usuario
    if (existeProyecto.creador.toString() !== req.user.id) {
       res.status(401).json({msg:" No AUTORIZADO"})
    }
    // creamos la actualizacion
    const actualizacion = {};
    actualizacion.nombre = nombre;
    actualizacion.estado = estado;
   

    tarea = await Tarea.findByIdAndUpdate(
       {_id: req.params.id},
       {$set:actualizacion},
       {new: true}
      ) 
      res.json({tarea})
      console.log('actualizacion', tarea.estado)
   } catch (error) {
      res.status(500).json({error: "ERROR EN EL SERVIDOR"})
      console.log(error);
   }

};

exports.eliminarTarea =async (req, res ) =>{
    try {
       // extraemos el proyecto 
       const {proyecto} = req.query;
       const proyectoExistente = await Proyecto.findById(proyecto);
       let tarea = await Tarea.findById(req.params.id);
       // SI LA TAREA EXITSTE
       if (!tarea) {
          res.status(404).json({msg:"TAREA NO EXISTENTE"})
       };
       // si el proyecto pertenece al usaurio
       if (proyectoExistente.creador.toString() !== req.user.id ) {
          res.status(401).json({msg:"USUARIO NO AUTRIZADO"})
       };
        console.log('existente', proyectoExistente.creador.toString())
        console.log('requser.id', req.user.id)
        
       tarea = await Tarea.findOneAndRemove({_id:req.params.id})

       res.json({mg:"Tarea eliminada"});
    } catch (error) {
      res.status(500).json({error: "ERROR EN EL SERVIDOR"})
      console.log(error);
    }
};