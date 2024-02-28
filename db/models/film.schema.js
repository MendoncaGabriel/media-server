const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
    type: String,
    name: String,
    file: String,
});

const Film = mongoose.model('film', FilmSchema);

module.exports = Film;



