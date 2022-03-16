const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51KZNchB2t3Q2dhmf0hrEorqHIVRVDd3QqMe3jvhmsO2faxQkaRInltaSw9drenJS3zOMq51aJbZv2JSLBK7PGBH8005qh3ZOcE"
);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) res.status(500).json(stripeErr);
      else res.status(201).json(stripeRes);
    }
  );
});

module.exports = router;
