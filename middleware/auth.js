const jwt = require('jsonwebtoken');

module.exports = function name(req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');
    // revisar si no hay token
    if(!token) return res.status(401).json({msg: "No hay token permiso no valido"})
    // validar el token 
    try{
      const cifrado = jwt.verify(token, process.env.SECRETA)
      req.user = cifrado.usuario;
      req.user = cifrado.user;
    //   console.log("req",req.user);
      next();
      
    }catch(error){
        return res.status(401).json({msg: "Token no valido", error: error})
    }
}