const Joi = require("joi");

const wishListSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
})

const validateWishList = (data) => wishListSchema.validate(data, { abortEarly: false });
module.exports= validateWishList;