const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    phone: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    whatsappPhone: { type: String },
    openingHoursWeekdays: { type: String, default: 'Monday - Saturday: 8:00 AM - 10:00 PM' },
    openingHoursSunday: { type: String, default: 'Sunday: 9:00 AM - 9:00 PM' },
    emergencyNote: { type: String, default: '24/7 Emergency Services Available' },
    mapQuery: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
