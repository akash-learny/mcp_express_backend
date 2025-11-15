import express from "express";
import Laboratory from "../models/laboratory.js";

const router = express.Router();

// Get all laboratories
router.get("/", async (req, res) => {
  try {
    const laboratories = await Laboratory.find();
    res.json(laboratories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a laboratory by ID
router.get("/:id", async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id);
    if (!laboratory) return res.status(404).json({ error: "Laboratory not found" });
    res.json(laboratory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new laboratory
router.post("/", async (req, res) => {
  try {
    const { name, organisationId, instituteId, departmentId, user, status, isActive, isDeleted } = req.body;
    if (!name || !organisationId || !instituteId || !departmentId) {
      return res.status(400).json({
        error: "name, organisationId, instituteId, departmentId are required."
      });
    }
    const newLaboratory = new Laboratory({
      name,
      organisationId,
      instituteId,
      departmentId,
      user,
      status,
      isActive,
      isDeleted
    });
    await newLaboratory.save();
    res.status(201).json(newLaboratory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a laboratory by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const laboratory = await Laboratory.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!laboratory) {
      return res.status(404).json({ error: "Laboratory not found" });
    }
    res.json(laboratory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a laboratory by ID
router.delete("/:id", async (req, res) => {
  try {
    const laboratory = await Laboratory.findByIdAndDelete(req.params.id);
    if (!laboratory) {
      return res.status(404).json({ error: "Laboratory not found" });
    }
    res.json({ message: "Laboratory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
