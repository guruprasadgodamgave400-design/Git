const router = require("express").Router();
const { body, param } = require("express-validator");
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/rooms.controller");

router.get("/", ctrl.listRooms);

router.get("/:id", [param("id").isMongoId()], ctrl.getRoom);

router.post(
  "/",
  auth,
  requireRole("admin"),
  [
    body("name").isString().trim().isLength({ min: 2, max: 200 }),
    body("description").isString().trim().isLength({ min: 10 }),
    body("price").isFloat({ min: 0 }),
    body("image").isString().notEmpty(),
    body("bed").isString().notEmpty(),
    body("guests").isInt({ min: 1 }),
    body("size").isString().notEmpty(),
    body("view").isString().notEmpty(),
    body("inventory").optional().isInt({ min: 0 }),
  ],
  ctrl.createRoom
);

router.patch(
  "/:id",
  auth,
  requireRole("admin"),
  [param("id").isMongoId()],
  ctrl.updateRoom
);

router.delete(
  "/:id",
  auth,
  requireRole("admin"),
  [param("id").isMongoId()],
  ctrl.deleteRoom
);

module.exports = router;