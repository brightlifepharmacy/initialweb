const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.js");

router.get("/api", productsController.api);
router.get("/", productsController.index);
router.get("/:slug", productsController.show);

module.exports = router;
