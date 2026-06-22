const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Review = require("../models/Review");

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { users: users.map((u) => u.toSafeJSON()) }));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!User.ROLES.includes(role)) throw new ApiError(400, "Invalid role");
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user.toSafeJSON(), "User updated"));
});

const stats = asyncHandler(async (_req, res) => {
  const [users, rooms, bookings, revenueAgg, reviewCount] = await Promise.all([
    User.countDocuments(),
    Room.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Review.countDocuments({ approved: true }),
  ]);
  const revenue = revenueAgg[0]?.total || 0;
  res.json(new ApiResponse(200, { users, rooms, bookings, revenue, reviews: reviewCount }));
});

module.exports = { listUsers, updateUserRole, stats };