const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: [String], default: [] },
    image: { type: String, default: '/images/article-allopathic.svg' },
    category: { type: String, default: 'Health Guide' },
    readTime: { type: String, default: '4 min read' },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
