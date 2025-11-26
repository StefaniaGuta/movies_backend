const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const validateMovieRequest = require('../middlewares/movies');
const auth = require('../middlewares/auth');

router.post('/movies', auth, validateMovieRequest, async (req, res) => {
  const owner = req.user._id;

  try {
    const newMovie = await Movie.create({
      owner,
      ...req.body
    });
    await newMovie.save()
    res.status(201).json(newMovie);

  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get('/movies', auth, async (req, res) => {
  const owner = req.user._id;
  const { type } = req.query;

  let filter = { owner };

  if (type) {
    filter.type = type;
  }

  try {
    const movies = await Movie.find(filter);
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

router.delete('/movies/:movieId', auth, async (req, res) => {
  const owner = req.user._id;
  const movieId = Number(req.params.movieId);

  const { mediaType, type } = req.query;

  if (!mediaType || !type) {
    return res.status(400).json({
      message: "mediaType and type query params are required."
    });
  }

  try {
    const movie = await Movie.findOneAndDelete({
      owner,
      movieId,
      mediaType,
      type
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found for deletion."
      });
    }

    res.status(200).json({ message: "Movie deleted successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;