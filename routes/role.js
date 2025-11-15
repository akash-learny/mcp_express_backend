import express from "express";
import Role from "../models/role.js";

const router = express.Router();

// Get all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a role by ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new role
router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      procedure_management,
      analytics_management,
      reports_management,
      profile_management,
      asset_management,
      runs_management,
      user_management,
      role_management,
      isActive,
      isDeleted
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Role name is required." });
    }
    const newRole = new Role({
      name,
      type,
      procedure_management,
      analytics_management,
      reports_management,
      profile_management,
      asset_management,
      runs_management,
      user_management,
      role_management,
      isActive,
      isDeleted
    });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a role by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a role by ID
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;