const router = require("express").Router();
const { body, param } = require("express-validator");
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/admin.controller");

router.use(auth, requireRole("admin"));

router.get("/users", ctrl.listUsers);

router.patch(
  "/users/:id",
  [param("id").isMongoId(), body("role").isIn(["user", "admin"])],
  ctrl.updateUserRole
);

router.get("/stats", ctrl.stats);

module.exports = router;