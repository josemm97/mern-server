const express = require('express');
const mongoose = require('mongoose');
const conectDb = require('./config/db');
const cors = require('cors');

//crear servidor
const app = express();
// coneccionde la  base de datos
conectDb();
// habilitamos cors
app.use(cors())
const { connection } = mongoose;
connection.once('open', () => {
console.log('Mongo database connected succelly');
});
mongoose.set('useCreateIndex', true)
//Habilitar expreess.json() para leer  datos que el usuarrio co
app.use(express.json({ extended: true }))
app.use(express.json());
// puerto de la app
const PORT = process.env.PORT || 4000;

// pagina principal
// Importamos las rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'))


app.listen(PORT,()=>{
    console.log(`el SERVIDOR esta corriendo  el puerto ${PORT}`)
} )