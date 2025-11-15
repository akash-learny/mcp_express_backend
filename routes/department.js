import express from "express";
import Department from "../models/department.js";

const router = express.Router();

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a department by ID
router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new department
router.post("/", async (req, res) => {
  try {
    const { name, departmentNumber, user, instituteId, organisationId, status, isActive, isDeleted } = req.body;
    if (!name || !instituteId || !organisationId) {
      return res.status(400).json({
        error: "name, instituteId, and organisationId are required."
      });
    }
    const newDepartment = new Department({
      name,
      departmentNumber,
      user,
      instituteId,
      organisationId,
      status,
      isActive,
      isDeleted
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a department by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const department = await Department.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a department by ID
router.delete("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
