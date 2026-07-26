const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config();

const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString, {
    dbName: "moviesColection"
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));

const authRouter = require('./routes/auth');
const listRouter = require('./routes/lists');
const wishRouter = require('./routes/wishList');

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(express.static('public'));
app.listen(5000, () => {
  console.log("Server is running. Use our API on port: 5000");
})

app.get('/', (req, res) => {
  res.json({ message: 'Welcome!' });
});

app.use('/api/auth', authRouter);
app.use('/api/list', listRouter);
app.use('/api/wishList', wishRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;