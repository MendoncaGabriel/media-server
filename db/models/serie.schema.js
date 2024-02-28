const mongoose = require('mongoose');

const SerieSchema = new mongoose.Schema({
    type: String,
    name: String,
    season: String,
    episode: String,
    extension: String,
    file: String,
});

const Serie = mongoose.model('serie', SerieSchema);

module.exports = Serie;



