const express = require("express");
const Therapy = require("../models/therapy");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, date, therapist, patient } = req.body;
    const therapy = new Therapy({ title, description, date, therapist, patient });
    await therapy.save();
    res.status(201).json({ message: "Therapy session created successfully", therapy });
  } catch (error) {
    console.error("Error creating therapy session:", error);
    res.status(500).json({ message: "Server error" });
  }
});
