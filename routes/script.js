import express from "express";
import Script from "../models/script.js";

const router = express.Router();

// GET all scripts
router.get("/", async (req, res) => {
  try {
    const scripts = await Script.find();
    res.json(scripts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single script by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Script.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Script not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new script
router.post("/", async (req, res) => {
  try {
    const { script, type, createdby, name } = req.body;

    const newItem = new Script({ script, type, createdby, name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a script by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Script.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: "Script not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a script by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Script.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Script not found" });
    res.json({ message: "Script deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


