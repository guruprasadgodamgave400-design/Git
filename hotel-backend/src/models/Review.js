const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    author: { type: String, required: true },
    location: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    body: { type: String, required: true, maxlength: 2000 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ room: 1, createdAt: -1 });

reviewSchema.statics.aggregateForRoom = async function aggregateForRoom(roomId) {
  const stats = await this.aggregate([
    { $match: { room: new mongoose.Types.ObjectId(roomId), approved: true } },
    {
      $group: {
        _id: "$room",
        rating: { $avg: "$rating" },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);
  if (!stats.length) return { rating: 0, reviewsCount: 0 };
  return { rating: stats[0].rating, reviewsCount: stats[0].reviewsCount };
};

reviewSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    roomId: this.room?.toString(),
    author: this.author,
    location: this.location,
    rating: this.rating,
    title: this.title,
    body: this.body,
    date: this.createdAt,
  };
};

module.exports = mongoose.model("Review", reviewSchema);