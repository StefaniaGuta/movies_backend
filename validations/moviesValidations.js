const Joi = require("joi");

const moviesSchema = Joi.object({
  movieId: Joi.number().required(),
  
  mediaType: Joi.string()
    .valid("movie", "tv")
    .required()
    .messages({ "any.only": "mediaType must be movie or tv" }),

  title: Joi.string().required(),

  posterPath: Joi.string().allow(null, ""),
  backdropPath: Joi.string().allow(null, ""),
  overview: Joi.string().allow(null, ""),
  releaseDate: Joi.string().allow(null, ""),

  type: Joi.string()
    .valid("favorite", "watchlist")
    .required()
});

const validateMovie = (data) => moviesSchema.validate(data, { abortEarly: false });
module.exports = validateMovie;
