import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  const handleRequestOtp = async () => {
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/otp-login", { email });
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }, // FIXED: Sending both email and OTP
        { withCredentials: true }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isOtpMode ? "Login with OTP" : "Login"}</h2>
        {error && <p className="error-message">{error}</p>}
        {!isOtpMode ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Login</button>
          </form>
        ) : !isOtpSent ? (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleRequestOtp} className="login-button">Send OTP</button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Verify OTP</button>
          </form>
        )}
        <p>
          {isOtpMode ? (
            <span onClick={() => setIsOtpMode(false)} style={{ cursor: "pointer", color: "blue" }}>
              Login with password
            </span>
          ) : (
            <span onClick={() => setIsOtpMode(true)} style={{ cursor: "pointer", color: "blue" }}>
              Login with OTP
            </span>
          )}
        </p>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
