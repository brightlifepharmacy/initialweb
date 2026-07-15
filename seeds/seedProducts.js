const mongoose = require('mongoose');
const Product = require('../models/product');
const dummyProducts = require('../utils/dummyProducts');

const dbUrl = process.env.ATLUSDB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brightlifepharmacy';

async function seed() {
  try {
    await mongoose.connect(dbUrl);
    console.log('connected to DB for seeding');

    // Remove existing products (safe for local/dev use)
    await Product.deleteMany({});

    // Map dummyProducts fields to Product schema where needed
    const docs = dummyProducts.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      type: p.type,
      category: p.category,
      manufacturer: p.manufacturer,
      dosage: p.dosage,
      pack: p.pack,
      size: p.size,
      features: p.features,
      price: p.price,
      priceText: p.priceText,
      availability: p.availability,
      requires_prescription: p.requires_prescription,
      image: p.image,
      imageColor: p.imageColor,
    }));

    const inserted = await Product.insertMany(docs);
    console.log(`Inserted ${inserted.length} products`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected DB after seeding');
  }
}

seed();
