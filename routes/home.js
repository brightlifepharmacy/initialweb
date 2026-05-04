const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.js");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, homeController.index);
router.get("/about", homeController.about);
router.get("/products", homeController.products);
router.get("/blogs", homeController.blogs);
router.get("/blogs/:idOrSlug", homeController.articleDetails);
router.get("/article/:idOrSlug", homeController.articleDetails);
router.get("/privacy-policy", homeController.privacy);
router.get("/terms", homeController.terms);
router.get("/contact", homeController.contact);

module.exports = router;
