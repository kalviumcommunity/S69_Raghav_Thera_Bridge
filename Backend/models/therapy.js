const mongoose = require("mongoose");

const TherapySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },

therapist: { type: String, required: true },
patient: { type: String, required: true }


}, { timestamps: true });

module.exports = mongoose.model("Therapy", TherapySchema);
