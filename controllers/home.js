const User = require("../models/user");
const products = require("../utils/dummyProducts.js");
const filterProducts = require("../utils/filterProducts.js");
const Article = require("../models/article");
const mongoose = require("mongoose");
const Contact = require("../models/contact");

async function getArticles(limit) {
  const query = Article.find({}).sort({ publishedAt: -1, createdAt: -1 });
  if (typeof limit === "number") {
    query.limit(limit);
  }

  const articles = await query.lean();
  return articles;
}

async function findArticle(idOrSlug) {
  const query = [
    { slug: idOrSlug },
  ];

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    query.unshift({ _id: idOrSlug });
  }

  const numericId = Number(idOrSlug);
  if (Number.isInteger(numericId)) {
    query.push({ legacyId: numericId });
  }

  const article = await Article.findOne({ $or: query }).lean();

  return article;
}

async function getContactInfo() {
  const contact = await Contact.findOne({}).sort({ updatedAt: -1, createdAt: -1 }).lean();
  return contact;
}

function buildMapSrc(contact) {
  const query = contact?.mapQuery || contact?.address || '123 Medical Street, Health District, Mumbai, Maharashtra 400001';
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

module.exports.index = async (req, res) => {
  try {
    const articles = await getArticles(3);
    const filteredProducts = filterProducts(products, req.query).slice(0, 4);
    res.render("brightlife/home.ejs", {
      products: filteredProducts,
      articles,
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
module.exports.refundPolicy = (req, res) => {
  res.render("others/refund-policy.ejs");
};
module.exports.sitemap = (req, res) => {
  res.render("others/sitemap.ejs");
};
module.exports.faq = (req, res) => {
  res.render("others/faq.ejs");
};

module.exports.products = (req, res) => {
  const filteredProducts = filterProducts(products, req.query);
  res.render("products/index.ejs", {
    products: filteredProducts,
    selectedCategory: req.query.category || "all",
  });
};
module.exports.contact = async (req, res) => {
  try {
    const fallbackContact = {
      phone: '+91 12345 67890',
      emergencyPhone: '+91 98765 43210',
      email: 'info@brightlifepharmacy.com',
      address: '123 Medical Street, Health District\nMumbai, Maharashtra 400001',
      whatsappPhone: '+911234567890',
      openingHoursWeekdays: 'Monday - Saturday: 8:00 AM - 10:00 PM',
      openingHoursSunday: 'Sunday: 9:00 AM - 9:00 PM',
      emergencyNote: '24/7 Emergency Services Available',
      mapQuery: '123 Medical Street, Health District, Mumbai, Maharashtra 400001',
    };

    const contact = await getContactInfo();
    const contactInfo = contact ? { ...fallbackContact, ...contact } : fallbackContact;
    const addressHtml = String(contactInfo.address || '').replace(/\n/g, '<br>');

    res.render("others/contact.ejs", {
      contactInfo,
      addressHtml,
      mapSrc: buildMapSrc(contactInfo),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong!");
    res.redirect("/");
  }
};

module.exports.blogs = (req, res) => {
  return getArticles()
    .then((articles) => {
      res.render("blogs/index.ejs", { articles });
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Something went wrong!");
      res.redirect("/");
    });
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

module.exports.homeDelivery = (req, res) => {
  res.render("others/home-delivery.ejs");
};

module.exports.freeConsultation = (req, res) => {
  res.render("others/free-consultation.ejs");
};

module.exports.articleDetails = (req, res) => {
  const articleId = req.params.idOrSlug || req.params.id;

  return findArticle(articleId)
    .then((article) => {
      if (!article) {
        req.flash("error", "Article not found");
        return res.redirect("/blogs");
      }

      res.render("blogs/article-details.ejs", { article });
    })
    .catch((error) => {
      console.log(error);
      req.flash("error", "Something went wrong!");
      res.redirect("/blogs");
    });
};
