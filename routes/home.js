const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.js");
const { isLoggedIn } = require("../middleware");

router.get("/", homeController.index);
router.get("/about", homeController.about);
router.get("/categories", homeController.categories);
router.get("/prescription-medicine", homeController.prescriptionMedicine);
router.get("/surgical-supply", homeController.surgicalSupply);
router.get("/first-aid-kits", homeController.firstAidKits);
router.get("/health-checkups", homeController.healthCheckups);
router.get("/home-delivery", homeController.homeDelivery);
router.get("/free-consultation", homeController.freeConsultation);
router.get("/privacy-policy", homeController.privacy);
router.get("/terms", homeController.terms);
router.get("/refund-policy", homeController.refundPolicy);
router.get("/sitemap", homeController.sitemap);
router.get("/faq", homeController.faq);

module.exports = router;
