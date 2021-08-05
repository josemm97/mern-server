const mongoose = require('mongoose');
require('dotenv').config({path: 'var.env'});

const conectDb = async()=>{

    try {
        await mongoose.connect(process.env.DB_MONGODB,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })

    } catch (error) {
        console.log(error);
        process.exit(1) // Detiene la app
    }
};
module.exports = conectDb;