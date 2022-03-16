const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();
const Cart = require("../models/Cart");

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();

    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(201).json("Cart deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// FIND PRODUCT
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(201).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
