const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  movieId: {
    type: Number,
    required: true
  },

  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  },

  title: {
    type: String,
    required: true
  },

  posterPath: String,
  backdropPath: String,
  overview: String,
  releaseDate: String,

  type: {
    type: String,
    enum: ['favorite', 'watchlist'],
    required: true
  }

}, {
  timestamps: true,
  versionKey: false
});

movieSchema.index(
  { owner: 1, movieId: 1, mediaType: 1, type: 1 },
  { unique: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
