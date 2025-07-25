import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; 
import ContactForm from "./pages/ContactForm";
import Sessions from "./pages/Sessions"; // Add this import

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Protected Route Wrapper
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sessions" element={<ProtectedRoute element={<Sessions />} />} />
        { <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} /> }
      </Routes>
      <ContactForm />
    </Router>
  );
};

export default App;
