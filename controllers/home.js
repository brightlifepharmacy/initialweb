const User = require("../models/user");
const products = require("../utils/dummyProducts.js");
const filterProducts = require("../utils/filterProducts.js");
const articles = require("../utils/dummyArticles.js");

function findArticle(idOrSlug) {
  return articles.find(
    (item) => String(item.id) === idOrSlug || item.slug === idOrSlug,
  );
}

module.exports.index = async (req, res) => {
  try {
    const filteredProducts = filterProducts(products, req.query).slice(0, 4);
    res.render("brightlife/home.ejs", {
      products: filteredProducts,
      articles: articles.slice(0, 3),
      selectedCategory: req.query.category || "all",
      selectedPrice: req.query.price || "all",
    });
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
  const filteredProducts = filterProducts(products, req.query);
  res.render("products/index.ejs", { products: filteredProducts });
};
module.exports.contact = (req, res) => {
  res.render("others/contact.ejs");
};

module.exports.blogs = (req, res) => {
  res.render("blogs/index.ejs", { articles });
};

module.exports.articleDetails = (req, res) => {
  const article = findArticle(req.params.idOrSlug);

  if (!article) {
    req.flash("error", "Article not found");
    return res.redirect("/blogs");
  }

  res.render("blogs/article-details.ejs", { article });
};
