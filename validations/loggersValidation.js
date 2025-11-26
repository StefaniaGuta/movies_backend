const { validateRegister, validateLogin } = require("./userValidation");

const validateRegisterRequest = (req, res, next) => {
  const { error } = validateRegister(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message)
    });
  }

  next();
};

const validateLoginRequest = (req, res, next) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message)
    });
  }

  next();
};

module.exports = {
  validateRegisterRequest,
  validateLoginRequest
};
