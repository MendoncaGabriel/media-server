const mongoose = require('mongoose')
require('dotenv').config()


mongoose.connect(process.env.URL_DB)
.then(()=>{
    console.log('Conectado ao banco de dados!')
})
.catch((err)=>{
    console.log('Erro ao se conectar ao baco de dados: ' + err)
})

module.exports = mongoose