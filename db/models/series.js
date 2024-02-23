const mongoose = require('mongoose')

const serieSchema = new mongoose.Schema({
    metadataId:{
       type: String,
       required: false 
    },
    name: {
        type:String,
        required: true
    },
    path: {
        type: String,
        require: true
    },
    episode:{
        type: Number,
        require: true
    },
    season:{
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('series', serieSchema)