const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string().min(6).required(),

  avatar: Joi.string().allow(null, "")
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string().required()
});
module.exports = {
  validateRegister: (data) => registerSchema.validate(data, { abortEarly: false }),
  validateLogin: (data) => loginSchema.validate(data, { abortEarly: false })
};

