import express from "express";
import Reports from "../models/reports.js";

const router = express.Router();

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Reports.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await Reports.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new report
router.post("/", async (req, res) => {
  try {
    const { reportName, analyticsId, content, createdOn, createdBy } = req.body;
    if (!reportName || !analyticsId) {
      return res.status(400).json({ error: "reportName and analyticsId are required." });
    }
    const newReport = new Reports({
      analyticsId,
      content,
      createdOn,
      createdBy,
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a report by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const report = await Reports.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a report by ID
router.delete("/:id", async (req, res) => {
  try {
    const report = await Reports.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;