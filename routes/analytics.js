import express from "express";
import Analytics from "../models/analytics.js";

const router = express.Router();

// Get all analytics
router.get("/", async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics by ID
router.get("/:id", async (req, res) => {
  try {
    const analytics = await Analytics.findById(req.params.id);
    if (!analytics) return res.status(404).json({ error: "Analytics not found" });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new analytics
router.post("/", async (req, res) => {
  try {
    const { name, runsId, runsNumber, createdOn, createdByName, results, imageUrls, analyticsChartsList } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }
    const newAnalytics = new Analytics({
      name,
      runsId,
      runsNumber,
      createdOn,
      createdByName,
      results: results || [],
      imageUrls: imageUrls || [],
      analyticsChartsList: analyticsChartsList || []
    });
    await newAnalytics.save();
    res.status(201).json(newAnalytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update analytics by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const analytics = await Analytics.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!analytics) {
      return res.status(404).json({ error: "Analytics not found" });
    }
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete analytics by ID
router.delete("/:id", async (req, res) => {
  try {
    const analytics = await Analytics.findByIdAndDelete(req.params.id);
    if (!analytics) {
      return res.status(404).json({ error: "Analytics not found" });
    }
    res.json({ message: "Analytics deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;