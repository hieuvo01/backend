const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoose_delete = require('mongoose-delete');

const Movie = new Schema({
    adult: { type: Boolean, default: false},
    backdrop_path: { type: String, default: ''},
    genre_ids: {type: Array},
    id: { type: Number, unique: true},
    original_language: { type: String, default: 'en'},
    original_title: { type: String, unique: true},
    overview: { type: String},
    popularity: { type: String},
    poster_path: { type: String},
    release_date: { type: Date, default: Date.now()},
    title: { type: String},
    video: { type: Boolean, default: false},
    vote_average: { type: String},
    vote_count: { type: Number},
    movie_type: { type: String, default: 'upcoming'}
}, {
    timestamps: true
})

Movie.plugin(mongoose_delete, {overrideMethods: 'all', deletedAt: true});

module.exports = mongoose.model('Movie', Movie);