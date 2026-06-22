const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");

function parseName(value) {
  return (value || "").trim();
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with that email already exists");

  const user = await User.create({
    name: parseName(name),
    email: email.toLowerCase(),
    password,
    phone,
  });

  const token = user.generateAuthToken();
  res.status(201).json(
    new ApiResponse(201, { user: user.toSafeJSON(), token }, "Registration successful")
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  const token = user.generateAuthToken();
  res.json(
    new ApiResponse(200, { user: user.toSafeJSON(), token }, "Login successful")
  );
});

const me = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user.toSafeJSON()));
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json(new ApiResponse(200, req.user.toSafeJSON(), "Profile updated"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "currentPassword and newPassword are required");
  }
  const user = await User.findById(req.user._id).select("+password");
  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  const token = user.generateAuthToken();
  res.json(new ApiResponse(200, { token }, "Password changed"));
});

module.exports = { register, login, me, updateMe, changePassword };