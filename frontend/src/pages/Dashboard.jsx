import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../styles/Dashboard.css'; 

const Dashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [therapies, setTherapies] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        therapist: '',
        patient: ''
    });

    // Fetch all therapies on page load
    useEffect(() => {
        fetchTherapies();
    }, []);

    const fetchTherapies = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/therapy');
            setTherapies(res.data);
        } catch (error) {
            console.error('Error fetching therapies:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/therapy', formData);
            console.log('Created therapy:', res.data);
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', therapist: '', patient: '' });
            fetchTherapies(); // Refresh list
        } catch (error) {
            console.error('Error creating therapy:', error);
        }
    };

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
                    <Link to="/clients" className="menu-item">Clients</Link>
                    <Link to="/sessions" className="menu-item">Sessions</Link>
                    <Link to="/thera-connect" className="menu-item">Thera Connect</Link>
                    <Link to="/progress-notes" className="menu-item">Progress Notes</Link>
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

                {/* Add Therapy Button */}
                <div className="add-therapy-section">
                    <button className="add-therapy-button" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "➕ Add Therapy Session"}
                    </button>
                </div>

                {/* Therapy Form */}
                {showForm && (
                    <form className="therapy-form" onSubmit={handleFormSubmit}>
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                        <input type="text" name="therapist" placeholder="Therapist" value={formData.therapist} onChange={handleInputChange} />
                        <input type="text" name="patient" placeholder="Patient" value={formData.patient} onChange={handleInputChange} />
                        <button type="submit">Save Therapy Session</button>
                    </form>
                )}

                {/* List of Therapy Sessions */}
                <div className="therapy-list">
                    <h3>Therapy Sessions</h3>
                    <ul>
                        {therapies.map((therapy) => (
                            <li key={therapy._id}>
                                <strong>{therapy.title}</strong> - {new Date(therapy.date).toLocaleDateString()} <br/>
                                Therapist: {therapy.therapist} | Patient: {therapy.patient}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
