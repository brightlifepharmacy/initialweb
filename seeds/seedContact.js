const mongoose = require('mongoose');
const Contact = require('../models/contact');

const dbUrl = process.env.ATLUSDB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brightlifepharmacy';

async function seed() {
  try {
    await mongoose.connect(dbUrl);
    console.log('connected to DB for contact seeding');

    await Contact.deleteMany({});

    await Contact.create({
      phone: '+91 12345 67890',
      emergencyPhone: '+91 98765 43210',
      email: 'info@brightlifepharmacy.com',
      address: '123 Medical Street, Health District\nMumbai, Maharashtra 400001',
      whatsappPhone: '+911234567890',
      openingHoursWeekdays: 'Monday - Saturday: 8:00 AM - 10:00 PM',
      openingHoursSunday: 'Sunday: 9:00 AM - 9:00 PM',
      emergencyNote: '24/7 Emergency Services Available',
      mapQuery: '123 Medical Street, Health District, Mumbai, Maharashtra 400001',
    });

    console.log('Inserted contact settings');
  } catch (err) {
    console.error('Contact seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected DB after contact seeding');
  }
}

seed();
