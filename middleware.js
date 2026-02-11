const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you are not logedin!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isVerified = async (req, res, next) => {
  const { email } = req.body; // 👍 extract only email

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/login");
  }

  if (!user.isVerified) {
    req.flash("error", "Please verify your email first.");
    return res.redirect(`/verify-email?email=${email}`);
  }

  next();
};
