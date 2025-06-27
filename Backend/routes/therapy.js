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

router.get("/", async (req, res) => {
  try {
    const therapies = await Therapy.find();
    res.json(therapies);
  } catch (error) {
    console.error("Error fetching therapies:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const therapy = await Therapy.findByIdAndUpdate(id, updates, { new: true });
    if (!therapy) return res.status(404).json({ message: "Therapy session not found" });

    res.json({ message: "Therapy session updated successfully", therapy });
  } catch (error) {
    console.error("Error updating therapy session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const therapy = await Therapy.findByIdAndDelete(id);

    if (!therapy) return res.status(404).json({ message: "Therapy session not found" });

    res.json({ message: "Therapy session deleted successfully" });
  } catch (error) {
    console.error("Error deleting therapy session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;