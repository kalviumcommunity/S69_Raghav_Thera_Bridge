const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const session = require("express-session");
const { body } = require("express-validator");
const otpService = require("../routes/otpservice"); // Ensure this file exists!

const router = express.Router();

// 🟢 Session Middleware (Must Be Loaded Before Routes)
router.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" },
  })
);

// 🟢 Middleware for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// 🟢 Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Login Route (Email & Password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" }).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 OTP Login Route (Send OTP)
router.post("/otp-login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = otpService.generateOTP();
    await otpService.sendOTP(email, otp); // Send OTP to email
    otpService.storeOTP(email, otp); // Store OTP in memory

    console.log(`🔹 OTP sent to ${email}: ${otp}`); // Debugging (Remove in production)
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🟢 OTP Verification Route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const isValidOtp = otpService.verifyOTP(email, otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.roles }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log(`✅ OTP verified for ${email}`);
    return res.json({ success: true, message: "OTP verified successfully", token, role: user.roles });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// 🟢 Protected Route (Example)
router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
