const router = require("express").Router();
const { body, param } = require("express-validator");
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/reviews.controller");

router.get("/", ctrl.listReviews);

router.post(
  "/",
  auth,
  [
    body("roomId").isMongoId(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("title").isString().trim().isLength({ min: 2, max: 140 }),
    body("body").isString().trim().isLength({ min: 4, max: 2000 }),
    body("location").optional().isString().trim().isLength({ max: 120 }),
  ],
  ctrl.createReview
);

router.delete(
  "/:id",
  auth,
  [param("id").isMongoId()],
  ctrl.deleteReview
);

module.exports = router;