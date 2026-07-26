const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const validateMovieRequest = require('../middlewares/movies');
const auth = require('../middlewares/auth');

router.post('/movies', auth, validateMovieRequest, async (req, res) => {
  const owner = req.user._id;
  const { wishList } = req.body; 

  try {
    const newMovie = await Movie.create({
      owner,
      ...req.body,
      wishList: wishList || null
    });
    res.status(201).json(newMovie);

  } catch (error) {
    console.log(error);
    console.log(wishList)
    res.status(500).json({ error});
  }
});

router.get('/movies', auth, async (req, res) => {
  const owner = req.user._id;
  const { wishList } = req.query;

  let filter = { owner };

  if (wishList === 'null') {
    filter.wishList = null;
  } else if (wishList) {
    filter.wishList = wishList;
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

    res.status(200).json({ message: "Movie deleted successfully.", movie });

  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.patch('/movies/:id/move', auth, async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;
  const { wishList } = req.body; 

  try {
    const movie = await Movie.findOneAndUpdate(
      { _id: id, owner },
      { wishList: wishList || null },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;