const mongoose = require('mongoose')

const filmSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    path: {
        type: String,
        require: true
    },

})

module.exports = mongoose.model('films', filmSchema)