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
  res.render("products/index.ejs", {
    products: filteredProducts,
    selectedCategory: req.query.category || "all",
  });
};
module.exports.contact = (req, res) => {
  res.render("others/contact.ejs");
};

module.exports.blogs = (req, res) => {
  res.render("blogs/index.ejs", { articles });
};

module.exports.categories = (req, res) => {
  const categoryCards = [
    {
      title: "Allopathic Medicines",
      description: "Prescription and over-the-counter medicines for everyday care and treatment.",
      icon: "fa-pills",
      count: products.filter((product) => product.category === "allopathic").length,
      href: "/products?category=allopathic",
      accent: "from-green-500 to-emerald-500",
    },
    {
      title: "Surgical Supplies",
      description: "Sterile gloves, masks, gauze, and essential disposables for procedures.",
      icon: "fa-syringe",
      count: products.filter((product) => product.category === "surgical").length,
      href: "/products?category=surgical",
      accent: "from-teal-500 to-cyan-500",
    },
    {
      title: "Medical Devices",
      description: "Home and clinical monitoring devices like thermometers, BP monitors, and oximeters.",
      icon: "fa-stethoscope",
      count: products.filter((product) => product.category === "devices").length,
      href: "/products?category=devices",
      accent: "from-orange-500 to-amber-500",
    },
  ];

  res.render("categories.ejs", { categoryCards });
};

module.exports.prescriptionMedicine = (req, res) => {
  res.render("others/prescription-medicine.ejs");
};

module.exports.surgicalSupply = (req, res) => {
  res.render("others/surgical-supply.ejs");
};

module.exports.firstAidKits = (req, res) => {
  res.render("others/first-aid-kits.ejs");
};

module.exports.healthCheckups = (req, res) => {
  res.render("others/health-checkups.ejs");
};

module.exports.articleDetails = (req, res) => {
  const article = findArticle(req.params.idOrSlug);

  if (!article) {
    req.flash("error", "Article not found");
    return res.redirect("/blogs");
  }

  res.render("blogs/article-details.ejs", { article });
};
