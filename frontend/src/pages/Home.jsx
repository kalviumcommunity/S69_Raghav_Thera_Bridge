import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';

const Home = () => {
    const navigate = useNavigate(); // Hook to navigate

    return (
        <div className="home-container">
            {/* Top Info Bar */}
            <div className="info-bar">
                <div className="logo">TheraBridge+</div>
                <div className="nav-links">
                    <a href="#about">About</a>
                    <a href="#treatments">Treatments</a>
                    <a href="#plans">Plans & Pricing</a>
                    <a href="#updates">Updates</a>
                </div>
                <div className="contact-info">info@mysite.com</div>
            </div>

            {/* Main Content */}
            <h1 className="home-title">TheraBridge+</h1>
            <p className="home-subtitle">Therapy managed right</p>
            <button className="home-login-btn" onClick={() => navigate('/login')}>
                LOGIN
            </button>
        </div>
    );
};

export default Home;
