import express from "express";
import User from "../models/user.js";
import Institute from "../models/institute.js";

const router = express.Router();

const formatDate = (date) => date.toLocaleDateString("en-US");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .populate("role institute organisation department lab");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .populate("role institute organisation department lab");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, role, institute, organisation, department, lab } = req.body;
    if (!firstName || !lastName || !email || !role || !institute || !organisation || !department || !lab) {
      return res.status(400).json({
        error: "All fields are required: firstName, lastName, email, role, institute, organisation, department, lab (all IDs)",
      });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
      institute,
      organisation,
      department,
      lab,
      status: "Active",
      isActive: true,
      isDeleted: false,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, role, status, isActive } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { firstName, lastName, role, status, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      isActive: updatedUser.isActive,
      organisationName: updatedUser.organisationName,
      department: updatedUser.department,
      lab: updatedUser.lab,
      createdAt: formatDate(updatedUser.createdAt),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, isActive: false, status: "Inactive" },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully (soft delete applied)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
