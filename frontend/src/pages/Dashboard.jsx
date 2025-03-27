import React from 'react';
import '../styles/Dashboard.css'; // Ensure this file exists

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="profile-section">
                    <img src="https://placekitten.com/100/100" alt="Profile" className="profile-image" />
                    <h2 className="therapist-name">Therapist Name</h2>
                </div>

                <nav className="menu">
                    <a href="#" className="menu-item active">
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="/clients" className="menu-item">
                        <i className="fas fa-users"></i> Clients
                    </a>
                    <a href="/sessions" className="menu-item">
                        <i className="fas fa-calendar-check"></i> Sessions
                    </a>
                    <a href="/thera-connect" className="menu-item">
                        <i className="fas fa-users"></i> Thera Connect
                    </a>
                    <a href="/progress-notes" className="menu-item">
                        <i className="fas fa-book"></i> Progress Notes
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="header-left">
                        <button className="menu-toggle">
                            <i className="fas fa-bars"></i>
                        </button>
                        <h1>TheraBridge</h1>
                    </div>
                    <div className="header-right">
                        <button className="icon-button"><i className="fas fa-bell"></i></button>
                        <button className="icon-button"><i className="fas fa-cog"></i></button>
                        <button className="icon-button"><i className="fas fa-user"></i></button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="dashboard-header">
                    <h2>Dashboard</h2>
                    <span>Let's get a quick overview...</span>
                    <select className="year-dropdown">
                        <option>2024-25</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="icon green"><i className="fas fa-calendar-check"></i></div>
                        <div>
                            <h3>24</h3>
                            <p>Active Sessions</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon blue"><i className="fas fa-users"></i></div>
                        <div>
                            <h3>120</h3>
                            <p>Clients</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon orange"><i className="fas fa-book"></i></div>
                        <div>
                            <h3>15</h3>
                            <p>Progress Notes</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="icon red"><i className="fas fa-calendar-day"></i></div>
                        <div>
                            <h3>5</h3>
                            <p>Upcoming Appointments</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
