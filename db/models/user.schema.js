const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    able:{
        type: Boolean,
        default: true
    },
    admin:{
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('user', userSchema)