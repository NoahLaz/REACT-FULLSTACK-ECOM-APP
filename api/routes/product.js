const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const Product = require("../models/Product");

// CREATE
router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updaterProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updaterProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(201).json("Product deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// FIND PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL PRODUCTS
router.get("/find", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(201).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// // GET USER STATS
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.getFullYear() - 1);

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);

//     res.status(201).json(data);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
