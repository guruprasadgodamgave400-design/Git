const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Review = require("../models/Review");

const listReviews = asyncHandler(async (req, res) => {
  const filter = { approved: true };
  if (req.query.roomId) filter.room = req.query.roomId;
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { reviews: reviews.map((r) => r.toPublicJSON()) }));
});

const createReview = asyncHandler(async (req, res) => {
  const { roomId, rating, title, body, location } = req.body;
  if (!roomId || !rating || !title || !body) {
    throw new ApiError(400, "roomId, rating, title and body are required");
  }
  const review = await Review.create({
    room: roomId,
    user: req.user._id,
    author: req.user.name,
    location,
    rating,
    title,
    body,
  });
  res.status(201).json(new ApiResponse(201, review.toPublicJSON(), "Review submitted"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You don't have access to this review");
  }
  await review.deleteOne();
  res.json(new ApiResponse(200, null, "Review deleted"));
});

module.exports = { listReviews, createReview, deleteReview };