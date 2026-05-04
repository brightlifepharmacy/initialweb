const express = require("express");
const router = express.Router();
const dummyProducts = require("../utils/dummyProducts.js");

router.get("/", (req, res) => {
  // This would typically fetch from database
  res.render("products/index", { products: dummyProducts });
});

router.get("/:slug", (req, res) => {
  const product = dummyProducts.find(p => p.slug === req.params.slug);
  
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/products");
  }
  
  res.render("products/product-details", { product });
});

module.exports = router;
