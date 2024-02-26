const mongoose = require('mongoose')

const metadataSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    releaseYear: {
        type: Number,
    },
    genre: {
        type: String,
    },
    creator: {
        type: String,
    },
    rating: {
        type: Number,
    },
    synopsis: {
        type: String,
    },
    image:{
        type: String,
    }
})

module.exports = mongoose.model('metadata', metadataSchema)