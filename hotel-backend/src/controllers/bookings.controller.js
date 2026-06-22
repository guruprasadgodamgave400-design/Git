const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const TAX_RATE = 0.12;

function parseDate(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

const checkAvailability = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, roomsCount = 1 } = req.query;
  if (!roomId || !checkIn || !checkOut) {
    throw new ApiError(400, "roomId, checkIn and checkOut are required");
  }
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) throw new ApiError(400, "Invalid dates");
  if (end <= start) throw new ApiError(400, "checkOut must be after checkIn");

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) throw new ApiError(404, "Room not found");

  const overlapping = await Booking.find({
    room: room._id,
    status: { $in: ["pending", "confirmed", "checked_in"] },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });
  const reserved = overlapping.reduce((sum, b) => sum + b.roomsCount, 0);
  const remaining = Math.max(0, room.inventory - reserved);
  const requested = Math.max(1, Number(roomsCount) || 1);
  const available = remaining >= requested;

  res.json(
    new ApiResponse(200, {
      roomId: room._id.toString(),
      checkIn: start,
      checkOut: end,
      inventory: room.inventory,
      reserved,
      remaining,
      requested,
      available,
    })
  );
});

const createBooking = asyncHandler(async (req, res) => {
  const {
    roomId,
    checkIn,
    checkOut,
    guests,
    roomsCount = 1,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    payment = "card",
  } = req.body;

  if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail) {
    throw new ApiError(400, "Missing required booking fields");
  }
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) throw new ApiError(400, "Invalid dates");
  if (end <= start) throw new ApiError(400, "checkOut must be after checkIn");

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) throw new ApiError(404, "Room not found");
  if (guests > room.guests * roomsCount) {
    throw new ApiError(400, `This room accommodates up to ${room.guests * roomsCount} guests`);
  }

  const overlapping = await Booking.find({
    room: room._id,
    status: { $in: ["pending", "confirmed", "checked_in"] },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });
  const reserved = overlapping.reduce((sum, b) => sum + b.roomsCount, 0);
  if (reserved + roomsCount > room.inventory) {
    throw new ApiError(409, "Not enough rooms available for the selected dates");
  }

  const nights = Booking.nightsBetween(start, end);
  const subtotal = nights * room.price * roomsCount;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  const booking = await Booking.create({
    user: req.user._id,
    room: room._id,
    checkIn: start,
    checkOut: end,
    nights,
    guests,
    roomsCount,
    pricePerNight: room.price,
    subtotal,
    taxes,
    total,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    payment,
    status: "confirmed",
    paymentStatus: payment === "hotel" ? "pending" : "paid",
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        bookingId: booking._id.toString(),
        status: booking.status,
        placedAt: booking.createdAt,
        booking: booking.toPublicJSON(),
        stay: {
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights: booking.nights,
          guests: booking.guests,
        },
        totals: { subtotal, taxes, total },
      },
      "Booking confirmed"
    )
  );
});

const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("room", "name image price view");
  res.json(new ApiResponse(200, { bookings: bookings.map((b) => b.toPublicJSON()) }));
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("room", "name image price view");
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You don't have access to this booking");
  }
  res.json(new ApiResponse(200, booking.toPublicJSON()));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You don't have access to this booking");
  }
  if (["checked_in", "checked_out", "cancelled"].includes(booking.status)) {
    throw new ApiError(409, `Cannot cancel a booking that is ${booking.status}`);
  }
  booking.status = "cancelled";
  await booking.save();
  res.json(new ApiResponse(200, booking.toPublicJSON(), "Booking cancelled"));
});

const listAllBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("room", "name price");
  res.json(new ApiResponse(200, { bookings: bookings.map((b) => b.toPublicJSON()) }));
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Booking.STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json(new ApiResponse(200, booking.toPublicJSON(), "Booking updated"));
});

module.exports = {
  checkAvailability,
  createBooking,
  listMyBookings,
  getBooking,
  cancelBooking,
  listAllBookings,
  updateBookingStatus,
  rangesOverlap,
};