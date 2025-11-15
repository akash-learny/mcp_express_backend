import express from "express";
import Organisation from "../models/organisation.js";
import Institute from "../models/institute.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const organisations = await Organisation.find({ isDeleted: false });
    res.status(200).json(organisations);
  } catch (error) {
    console.error("Error fetching organisations:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id);

    if (!organisation || organisation.isDeleted) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    res.status(200).json(organisation);
  } catch (error) {
    console.error("Error fetching organisation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, institute, isActive, isDeleted } = req.body;

    if (!name || !institute) {
      return res.status(400).json({ message: "Name and institute are required." });
    }

    const existingInstitute = await Institute.findById(institute);
    if (!existingInstitute) {
      return res.status(400).json({ message: "Invalid institute ID. Institute not found." });
    }

    const organisation = new Organisation({
      name,
      institute,
      isActive: isActive ?? true,
      isDeleted: isDeleted ?? false,
    });

    const savedOrg = await organisation.save();

    return res.status(201).json({
      data: savedOrg,
    });
  } catch (error) {
    console.error("Error creating organisation:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const organisation = await Organisation.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!organisation) {
      return res.status(404).json({ error: "Organisation not found" });
    }

    res.json(organisation);
  } catch (err) {
    console.error("Error updating organisation:", err);
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedOrg = await Organisation.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedOrg) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    res.status(200).json({
      message: "Organisation deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting organisation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
