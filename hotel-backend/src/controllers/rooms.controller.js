const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Room = require("../models/Room");
const Review = require("../models/Review");

async function attachStats(rooms) {
  const ids = rooms.map((r) => r._id);
  const stats = await Review.aggregate([
    { $match: { room: { $in: ids }, approved: true } },
    { $group: { _id: "$room", rating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } },
  ]);
  const byRoom = new Map(stats.map((s) => [s._id.toString(), { rating: s.rating, reviewsCount: s.reviewsCount }]));
  return rooms.map((r) => {
    const s = byRoom.get(r._id.toString()) || { rating: 0, reviewsCount: 0 };
    return r.toPublicJSON(s);
  });
}

const listRooms = asyncHandler(async (req, res) => {
  const { featured, view, q, minPrice, maxPrice, sort = "recommended", limit = 50 } = req.query;
  const filter = { isActive: true };
  if (featured === "true") filter.featured = true;
  if (view) filter.view = view;
  if (q) filter.$or = [
    { name: new RegExp(q, "i") },
    { description: new RegExp(q, "i") },
    { tagline: new RegExp(q, "i") },
  ];
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let query = Room.find(filter);
  if (sort === "price-asc") query = query.sort({ price: 1 });
  else if (sort === "price-desc") query = query.sort({ price: -1 });
  else if (sort === "rating") query = query.sort({ featured: -1, createdAt: -1 });
  else query = query.sort({ featured: -1, createdAt: -1 });

  const rooms = await query.limit(Math.min(100, Number(limit) || 50));
  const data = await attachStats(rooms);
  res.json(new ApiResponse(200, { rooms: data }));
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room || !room.isActive) throw new ApiError(404, "Room not found");
  const stats = await Review.aggregateForRoom(room._id);
  res.json(new ApiResponse(200, room.toPublicJSON(stats)));
});

const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  const stats = await Review.aggregateForRoom(room._id);
  res.status(201).json(new ApiResponse(201, room.toPublicJSON(stats), "Room created"));
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new ApiError(404, "Room not found");
  const stats = await Review.aggregateForRoom(room._id);
  res.json(new ApiResponse(200, room.toPublicJSON(stats), "Room updated"));
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!room) throw new ApiError(404, "Room not found");
  res.json(new ApiResponse(200, null, "Room archived"));
});

module.exports = { listRooms, getRoom, createRoom, updateRoom, deleteRoom };