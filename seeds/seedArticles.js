const mongoose = require('mongoose');
const Article = require('../models/article');
const dummyArticles = require('../utils/dummyArticles');

const dbUrl = process.env.ATLUSDB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/initialweb';

async function seed() {
  try {
    await mongoose.connect(dbUrl);
    console.log('connected to DB for article seeding');

    await Article.deleteMany({});

    const docs = dummyArticles.map((article) => ({
      legacyId: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      image: article.image,
      category: article.category || 'Health Guide',
      readTime: article.readTime || '4 min read',
      publishedAt: article.publishedAt || new Date(),
    }));

    const inserted = await Article.insertMany(docs);
    console.log(`Inserted ${inserted.length} articles`);
  } catch (err) {
    console.error('Article seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected DB after article seeding');
  }
}

seed();
