import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Sessions.css";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    therapist: "",
    patient: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const USE_LLM = true; // Toggle this to false to always use fallback

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/therapy");
      setSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      therapist: "",
      patient: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/therapy/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/therapy", formData);
      }
      fetchSessions();
      resetForm();
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleEdit = (session) => {
    setFormData({
      title: session.title,
      description: session.description,
      date: session.date.split("T")[0],
      therapist: session.therapist,
      patient: session.patient,
    });
    setEditingId(session._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await axios.delete(`http://localhost:5000/api/therapy/${id}`);
        fetchSessions();
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const handleSuggestDescription = async () => {
    setLoadingSuggestion(true);
    try {
      if (USE_LLM) {
        const res = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant for therapists writing session descriptions.",
              },
              {
                role: "user",
                content: `Suggest a short therapy session description for the title "${formData.title}" and patient "${formData.patient}".`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const suggestion = res.data.choices[0].message.content;
        setFormData((prev) => ({ ...prev, description: suggestion }));
      } else {
        throw new Error("LLM temporarily disabled");
      }
    } catch (error) {
      console.warn("LLM API failed or disabled. Using fallback.");
      const fallback = `Session for ${formData.patient} on "${formData.title}". Focused on therapeutic support and guidance.`;
      setFormData((prev) => ({ ...prev, description: fallback }));
    }
    setLoadingSuggestion(false);
  };

  return (
    <div className="sessions-container">
      <h2>Therapy Sessions</h2>

      <button
        className="add-session-button"
        onClick={() => {
          setShowForm(!showForm);
          resetForm();
        }}
      >
        {showForm ? "Cancel" : "➕ Add New Session"}
      </button>

      {showForm && (
        <form className="session-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleSuggestDescription}>
              {loadingSuggestion ? "Suggesting..." : "✨ Suggest"}
            </button>
          </div>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="therapist"
            placeholder="Therapist"
            value={formData.therapist}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="patient"
            placeholder="Patient"
            value={formData.patient}
            onChange={handleInputChange}
          />
          <button type="submit">{editingId ? "Update Session" : "Save Session"}</button>
        </form>
      )}

      <div className="sessions-list">
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session) => (
              <li key={session._id}>
                <div>
                  <strong>{session.title}</strong> |{" "}
                  {new Date(session.date).toLocaleDateString()} <br />
                  Therapist: {session.therapist} | Patient: {session.patient}
                </div>
                <div className="session-actions">
                  <button className="edit-button" onClick={() => handleEdit(session)}>
                    📝 Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(session._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions found.</p>
        )}
      </div>
    </div>
  );
};

export default Sessions;
