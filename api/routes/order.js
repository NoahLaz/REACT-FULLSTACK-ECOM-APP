const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();
const Order = require("../models/Order");

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(201).json("Order deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// // FIND ORDER
// router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// FIND USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });

    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonths = new Date(date.setMonth(date.getMonth() - 2));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonths },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
