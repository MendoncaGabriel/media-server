const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    episodeNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
});

const seasonSchema = new mongoose.Schema({
    seasonNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    episodes: [episodeSchema],
});

const serieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sinopse: {
        type: String,
    },
    cover: {
        type: String,
    },
    seasons: [seasonSchema],
});

const Serie = mongoose.model('Serie', serieSchema);

module.exports = Serie;



