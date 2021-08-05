const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');



exports.crearUsuario = async (req, res)=>{
    // validamos si hay errores
       const errors = validationResult(req);
       if (errors.errors.length > 0 ) {
           return res.status(400).json({errores: errors})
       }
    // extraer email y password
    const {email, password} =  req.body;
   try {
       // revisar que el usaurio sea unico
       let usuario = await Usuario.findOne({email})
       if(usuario){
           return res.status(400).json({msg: ' EL USUARIO YA EXISTE'})
       }
      
    //    const salt =  await bcryptjs.genSalt(5);
    //    
       
       //crea el usuario
       usuario = new Usuario(req.body);

        // Hasheamos el password
        const salt = await bcryptjs.genSalt(10);
        const numeroString = Number.toString(password);
        // const string =
        usuario.password = await bcryptjs.hash(password, salt);
       
       // GUarda el usaurio
       await usuario.save();
       // CREAR Y FIRMAR EL WEB TOKEN
       const payload = {
           user:{
               id: usuario.id,
           }


       }
       //firmar el web token
       jwt.sign(payload, process.env.SECRETA,{
           expiresIn: 3600000
       },(error, token)=>{
            if(error) throw error;
            // mensaje de confirmacion
            res.json({token: token})
       })

    //    res.json({
    //     msg : 'Usuario creado correctamente',
    //     usuario: usuario
    // })
   } catch (error) {
       console.log(error);
       res.status(400).json({ error : `${error}`})
   }

};