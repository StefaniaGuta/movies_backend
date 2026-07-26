const validateWishListSchema = require("../validations/wishListValidations");

const validReq = (req, res, next) => {
    const { error } = validateWishListSchema(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message)
      });
    }

  next();
}

module.exports = validReq;