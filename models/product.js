const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  type: { type: String, default: 'medicine' },
  category: String,
  manufacturer: String,
  dosage: String,
  pack: String,
  size: String,
  features: String,
  price: { type: Number, default: 0 },
  priceText: String,
  availability: { type: String, default: 'In Stock' },
  requires_prescription: { type: Boolean, default: false },
  image: String,
  imageColor: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
