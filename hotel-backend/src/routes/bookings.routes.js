const router = require("express").Router();
const { body, param } = require("express-validator");
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/bookings.controller");

router.get("/availability", ctrl.checkAvailability);

router.get("/mine", auth, ctrl.listMyBookings);

router.post(
  "/",
  auth,
  [
    body("roomId").isMongoId(),
    body("checkIn").isISO8601(),
    body("checkOut").isISO8601(),
    body("guests").isInt({ min: 1, max: 12 }),
    body("roomsCount").optional().isInt({ min: 1, max: 5 }),
    body("guestName").isString().trim().isLength({ min: 2, max: 120 }),
    body("guestEmail").isEmail().normalizeEmail(),
    body("guestPhone").optional().isString().trim().isLength({ max: 30 }),
    body("specialRequests").optional().isString().isLength({ max: 1000 }),
    body("payment").optional().isIn(["card", "upi", "hotel"]),
  ],
  ctrl.createBooking
);

router.get(
  "/:id",
  auth,
  [param("id").isMongoId()],
  ctrl.getBooking
);

router.post(
  "/:id/cancel",
  auth,
  [param("id").isMongoId()],
  ctrl.cancelBooking
);

router.get(
  "/",
  auth,
  requireRole("admin"),
  ctrl.listAllBookings
);

router.patch(
  "/:id/status",
  auth,
  requireRole("admin"),
  [
    param("id").isMongoId(),
    body("status").isIn(["pending", "confirmed", "cancelled", "checked_in", "checked_out"]),
  ],
  ctrl.updateBookingStatus
);

module.exports = router;