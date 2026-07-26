const express = require('express');
const router = express.Router();
const Wish = require('../models/wishListModule');
const validReq = require('../middlewares/wishList');
const auth = require('../middlewares/auth');


router.post('/wishListCreate', auth, validReq, async(req, res) => {
    const owner = req.user._id;

    try {
    const newWish = await Wish.create({
      owner,
      ...req.body
    });
    await newWish.save()
    res.status(201).json(newWish);

  } catch (error) {
    console.log(error, "error")
    return res.status(500).json({ message: "Server error." });
  }
});


router.get('/myWishList', auth, async(req, res) => {
  const owner = req.user._id;
  try{
    const wishLists = await Wish.find({owner});
    res.status(200).json({wishLists});
  } catch (error) { 
      console.log(error)
      console.log(req)
    }
});

router.get('/:id', auth, async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  try {
    const wish = await Wish.findOne({ _id: id, owner });

    if (!wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    res.status(200).json(wish);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;

  try {
    const deletedWish = await Wish.findOneAndDelete({ _id: id, owner });

    if (!deletedWish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    res.status(200).json({ message: "Wish deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/:id', auth, async (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedWish = await Wish.findOneAndUpdate(
      { _id: id, owner },
      { name, description },
      { new: true }
    );

    if (!updatedWish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    res.status(200).json(updatedWish);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
