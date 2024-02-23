const mongoose = require('mongoose')

const metadataSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    cover:{
        type: String,
    },
    type:{
        type: String
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
    }
})

module.exports = mongoose.model('metadata', metadataSchema)