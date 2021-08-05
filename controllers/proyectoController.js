 const Proyecto = require('../models/proyecto.model');
 const {validationResult} = require('express-validator');
 const mongoose = require('mongoose');

 exports.crearProyecto = async (req,res) =>{
    const errores = validationResult(req);
    if (errores.errors.length > 0) {
        return res.status(400).json({msg: errores.errors[0]})
    }
    try {
        // crear proyecto
        const proyecto =  new Proyecto(req.body); 
        proyecto.creador = req.user.id
        // console.log('reqc',);
        await proyecto.save();
        res.json({proyecto: proyecto})
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"Hubo un errror en el servidor"
        })
    }
 };
 // obbtener proyectos
 exports.obtenerProyectos = async (req, res)=>{
   try {
       const proyectos =  await Proyecto.find({ creador: req.user.id}).sort({creado: -1 });
       res.json({proyectos: proyectos})
    } catch (error) {
        res.status(400).json({msg: error})
   }
 }


 // Actualizar un proyecto
  exports.actualizarProyecto = async (req, res)=>{
    
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({msg: errores.errors[0]})
    }
    // extraer la informacion del proyecto
    let { nombre } = req.body;
    let proyectoActualizado = {};
    if (nombre) {
        proyectoActualizado.nombre = nombre;
    }
    try {
            // console.log(req.params.id);
            let proyecto = await Proyecto.findById(req.params.id)
            // console.log(proyecto._id)
            
            
            // // revisar el Id
            // // si el pryecto existe
            if (!proyecto) {
                return res.status(404).json({msg: "Proyecto no enecontrado"})
            }
            // verificar el creador
            if(proyecto.creador.toString() !== req.user.id){   
                return res.status(401).json({msg: "creador no encontrado"})

            }
        // actualizar
            proyecto = await Proyecto.findByIdAndUpdate(
                {_id: req.params.id,},
                {$set: proyectoActualizado},
                {new: true}
                 )
            res.json({proyecto: proyecto})  
                        // verificar el creador

    } catch (error) {
        res.status(400).json({ error: error })
        console.log(error)
    }
  };

  exports.eliminarProyecto = async (req, res)=> {
    
    try {
        const proyecto = await Proyecto.findById(req.params.id)
        // revisamos si existe el proyecto
        if(!proyecto){
            return res.status(404).json({error: "Proyecto no enecontrado"})
        }
        // revisamos el creador
        if (proyecto.creador.toString() !== req.user.id) {
            return res.status(401).json({msg: "No autorizado"})
        }
        // eliminamos 
        await Proyecto.findByIdAndDelete({_id: req.params.id}) 
        //
        // console.log(proyecto.creador)
        res.json({msg: " Proyecto Elimindado"})
        // console.log(proyecto.creador.toString());

        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: " error en el servidor" });
    }

  };