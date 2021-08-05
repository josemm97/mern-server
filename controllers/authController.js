const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req, res)=>{
    // Revisar si hay errores
    const errors = validationResult(req);
    if (errors.errors.length > 0 ) {
        return res.status(400).json({errores: errors})
    }

    // Extraemos passsword
    const {email, password} = req.body;
    try {
        // Revisar si hay un usuario registrado
        let usuario = await Usuario.findOne({ email }); 
        if (!usuario) {
            return res.status(400).json({msg: "El usuario no existe"})
        } 
        // Revisar Password
        const passwordCorrecto = await bcryptjs.compare(password, usuario.password); 
        if (!passwordCorrecto) {
            return res.status(400).json({msg: "password Incorrecto"})
        }  
        // si todo es correcto 
        const payload = {
               user:{
                   id: usuario.id
               }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        },(error, token)=>{
            if(error) throw error;
            res.json({token})
        })
    } catch (error) {
        res.json({msg: error})
        
    }
}
// obtiene usuario autenticado 
exports.obtenerUsuario =  async (req,res) => {
    try {
        const usuario = await  Usuario.findById(req.user.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"ERROR EN EL SERVIDOR"})
    }
}