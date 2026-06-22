const mongoose = require("mongoose");

const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "checked_in", "checked_out"];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, min: 1 },
    roomsCount: { type: Number, required: true, min: 1, default: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: BOOKING_STATUSES, default: "confirmed" },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String },
    specialRequests: { type: String, maxlength: 1000 },
    payment: { type: String, enum: ["card", "upi", "hotel"], default: "card" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

bookingSchema.statics.STATUSES = BOOKING_STATUSES;

bookingSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    room: this.room?.toString(),
    checkIn: this.checkIn,
    checkOut: this.checkOut,
    nights: this.nights,
    guests: this.guests,
    roomsCount: this.roomsCount,
    pricePerNight: this.pricePerNight,
    subtotal: this.subtotal,
    taxes: this.taxes,
    total: this.total,
    status: this.status,
    guestName: this.guestName,
    guestEmail: this.guestEmail,
    guestPhone: this.guestPhone,
    specialRequests: this.specialRequests,
    payment: this.payment,
    paymentStatus: this.paymentStatus,
    createdAt: this.createdAt,
  };
};

bookingSchema.statics.nightsBetween = function nightsBetween(checkIn, checkOut) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((checkOut - checkIn) / ms));
};

module.exports = mongoose.model("Booking", bookingSchema);