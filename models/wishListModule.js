const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
})

const Wish = mongoose.model("wish", wishSchema);
module.exports = Wish;