const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authcontroller.js");
const { saveRedirectUrl, setMetatag } = require("../middleware.js");

router.get("/forgot-password", authController.restform);
router.post("/forgot-password", saveRedirectUrl, authController.forgotPassword);
router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authController.postResetPassword);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in using Google!");
    res.redirect("/");
  },
);

module.exports = router;
