const router = require("express").Router();
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { validateRegisterRequest, validateLoginRequest } = require("../validations/loggersValidation");
const auth = require("../middlewares/auth");

router.post("/register", validateRegisterRequest, async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const user = await User.create({ username, email, password, avatar });

    return res.status(201).json({
      message: "User registered successfully.",
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", validateLoginRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password." });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) return res.status(404).json({ message: "User not found." });

  res.status(200).json(user);
});


router.post("/logout", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;