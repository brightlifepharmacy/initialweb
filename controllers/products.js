const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');

const ALLOWED_CATEGORIES = new Set(['all', 'allopathic', 'surgical', 'devices']);
const CATEGORY_ALIASES = new Map([
  ['medicine', 'allopathic'],
  ['device', 'devices'],
]);

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeCategory(rawCategory) {
  if (!rawCategory || rawCategory === 'all') {
    return 'all';
  }

  const normalized = CATEGORY_ALIASES.get(rawCategory) || rawCategory;
  if (!ALLOWED_CATEGORIES.has(normalized)) {
    throw new ExpressError(400, 'Invalid category value.');
  }

  return normalized;
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parsePagination(query) {
  const limit = Math.min(parsePositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);
  const requestedPage = parsePositiveInt(query.page, 1);

  return { limit, requestedPage };
}

function buildFilter(query) {
  const category = normalizeCategory(query.category);
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const filter = {};

  if (category !== 'all') {
    filter.category = category;
  }

  if (search) {
    const q = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: q }, { description: q }, { manufacturer: q }];
  }

  return { filter, category, search };
}

async function getProductsPageData(query) {
  const { filter, category, search } = buildFilter(query);
  const { limit, requestedPage } = parsePagination(query);
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * limit;

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    products,
    category,
    search,
    currentPage,
    totalPages,
    totalProducts,
    limit,
  };
}

module.exports.index = async (req, res, next) => {
  try {
    const pageData = await getProductsPageData(req.query);

    const acceptHeader = req.get('accept') || '';
    const wantsJson = req.originalUrl.includes('format=json') || req.xhr || acceptHeader.includes('application/json');
    console.log('products.index', req.originalUrl, wantsJson);

    if (wantsJson) {
      return res.json(pageData);
    }

    res.render('products/index.ejs', {
      ...pageData,
      selectedCategory: pageData.category,
      searchQuery: pageData.search,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.api = async (req, res, next) => {
  try {
    const pageData = await getProductsPageData(req.query);
    res.json(pageData);
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug }).lean();
    if (!product) {
      // try by id
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(slug)) {
        product = await Product.findById(slug).lean();
      }
    }

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    res.render('products/product-details.ejs', { product });
  } catch (err) {
    next(err);
  }
};
