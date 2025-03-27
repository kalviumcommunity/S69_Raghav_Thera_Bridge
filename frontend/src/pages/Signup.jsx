// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [practiceType, setPracticeType] = useState("individual");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        practiceType,
        email,
        password,
      });

      console.log("Signup Response:", res.data); // Debugging log

      if (res.data.token) {
        localStorage.setItem("token", res.data.token); // Store JWT
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`; // Set token for future requests

        setTimeout(() => {
          navigate("/login"); // Ensure smooth redirection
        }, 500);
      } else {
        setError("Signup successful but token missing. Try logging in.");
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message); // Debugging log
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />

          <label htmlFor="practiceType">Practice Type</label>
          <select
            id="practiceType"
            value={practiceType}
            onChange={(e) => setPracticeType(e.target.value)}
            required
          >
            <option value="individual">Individual Practice</option>
            <option value="organization">Organization</option>
          </select>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />

          <button type="submit" className="signup-button">Signup</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
