const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

// Temporarily store OTPs (Replace with Redis or DB for production)
const otpStorage = new Map();

// Ensure SMTP credentials are available
if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error("SMTP credentials are missing in environment variables.");
    process.exit(1);
}

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // Use App Password instead of real password
    },
    tls: { rejectUnauthorized: false },
});

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<void>}
 */
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"TheraBridge+" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Your OTP Code for TrackMate",
            text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
            html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
        throw new Error("Failed to send OTP. Please try again.");
    }
};

/**
 * Store OTP temporarily with auto-delete after expiry
 * @param {string} email - User's email
 * @param {string} otp - OTP code
 */
const storeOTP = (email, otp) => {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    otpStorage.set(email, { otp, expiresAt });

    console.log(`🔹 Stored OTP for ${email}: ${otp} (Expires At: ${new Date(expiresAt)})`);

    // Auto-delete OTP after expiry
    setTimeout(() => {
        otpStorage.delete(email);
        console.log(`🗑️ OTP expired & deleted for ${email}`);
    }, 10 * 60 * 1000);
};

/**
 * Verify OTP
 * @param {string} email - User's email
 * @param {string} enteredOTP - OTP entered by the user
 * @returns {boolean} - True if valid, else false
 */
const verifyOTP = (email, enteredOTP) => {
    const otpData = otpStorage.get(email);

    if (!otpData) {
        console.warn(`⚠️ No OTP found for email: ${email}`);
        return false;
    }

    if (otpData.otp !== enteredOTP) {
        console.warn(`🚫 Invalid OTP entered for email: ${email}`);
        return false;
    }

    otpStorage.delete(email); // Remove OTP after successful verification
    console.log(`✅ OTP verified successfully for ${email}`);
    return true;
};

module.exports = { generateOTP, sendOTP, storeOTP, verifyOTP };
