const User = require("../models/user");

module.exports.index = async (req, res) => {
  try {
    res.render("brightlife/home.ejs");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong!");
    res.redirect("/login");
  }
};

module.exports.about = (req, res) => {
  res.render("others/about.ejs");
};
module.exports.privacy = (req, res) => {
  res.render("others/privacy.ejs");
};
module.exports.terms = (req, res) => {
  res.render("others/terms.ejs");
};

module.exports.products = (req, res) => {
  res.render("products/index.ejs");
};
module.exports.contact = (req, res) => {
  res.render("others/contact.ejs");
};
