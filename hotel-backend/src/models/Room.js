const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    bed: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    view: { type: String, required: true },
    amenities: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    inventory: { type: Number, default: 5, min: 0 },
  },
  { timestamps: true }
);

roomSchema.index({ featured: 1, isActive: 1 });
roomSchema.index({ view: 1 });

roomSchema.methods.toPublicJSON = function toPublicJSON(ratingStats) {
  const stats = ratingStats || { rating: 0, reviewsCount: 0 };
  return {
    id: this._id.toString(),
    name: this.name,
    tagline: this.tagline,
    description: this.description,
    price: this.price,
    image: this.image,
    gallery: this.gallery,
    bed: this.bed,
    guests: this.guests,
    size: this.size,
    view: this.view,
    amenities: this.amenities,
    featured: this.featured,
    inventory: this.inventory,
    rating: Number(stats.rating.toFixed(2)),
    reviewsCount: stats.reviewsCount,
  };
};

module.exports = mongoose.model("Room", roomSchema);