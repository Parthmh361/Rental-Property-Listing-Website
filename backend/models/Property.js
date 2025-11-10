const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    sizeSqft: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['Apartment', 'Villa', 'Studio', 'Independent House'], default: 'Apartment' },
    furnishing: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], default: 'Semi-Furnished' },
    amenities: [{ type: String }],
    imageUrl: { type: String, trim: true },
    gallery: [{ type: String }],
    availableFrom: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    ownerName: { type: String, trim: true },
    ownerPhone: { type: String, trim: true },
    ownerEmail: { type: String, trim: true, lowercase: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
