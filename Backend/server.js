const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Required for storing OTP in session

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust origin based on frontend
app.use(cookieParser());

// Use sessions to store OTP temporarily
app.use(session({
  secret: 'your_session_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set 'secure: true' when in production with HTTPS
}));

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit process if database fails
  }
};

// Import routes
const authRoutes = require("./routes/auth");
const therapyRoutes = require("./routes/therapy");

// Root route (for browser)
app.get("/", (req, res) => {
  res.send("TheraBridge Backend Server is running 🚀");
});

// API routes
app.use("/api/auth", authRoutes);  
app.use("/api/therapy", therapyRoutes);

// Start server after DB connection
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
};

startServer();