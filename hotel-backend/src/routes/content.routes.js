const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/content.controller");

router.get("/amenities", ctrl.getAmenities);
router.put("/amenities", auth, requireRole("admin"), ctrl.setAmenities);

router.get("/testimonials", ctrl.getTestimonials);
router.put("/testimonials", auth, requireRole("admin"), ctrl.setTestimonials);

router.get("/offers", ctrl.getOffers);
router.put("/offers", auth, requireRole("admin"), ctrl.setOffers);

module.exports = router;