const router = require("express").Router();
const { body } = require("express-validator");
const { auth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 80 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 8, max: 128 }),
    body("phone").optional().isString().trim().isLength({ max: 30 }),
  ],
  ctrl.register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().notEmpty(),
  ],
  ctrl.login
);

router.get("/me", auth, ctrl.me);

router.patch(
  "/me",
  auth,
  [
    body("name").optional().isString().trim().isLength({ min: 2, max: 80 }),
    body("phone").optional().isString().trim().isLength({ max: 30 }),
  ],
  ctrl.updateMe
);

router.post(
  "/change-password",
  auth,
  [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().isLength({ min: 8, max: 128 }),
  ],
  ctrl.changePassword
);

module.exports = router;