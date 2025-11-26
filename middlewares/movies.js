const validateSchema = require("../validations/moviesValidations");

const validateMovieRequest = (req, res, next) => {
  const { error } = validateSchema(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details.map((err) => err.message)
    });
  }

  next();
};

module.exports = validateMovieRequest;
