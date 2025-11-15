import express from "express";
import Institute from "../models/institute.js";

const router = express.Router();

router.get("/",async (req, res) => {
    try {
        const institutes = await Institute.find();
        res.json(institutes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
  try {
    const { name, isActive, isDeleted } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Institute name is required."
      });
    }
    const newInstitute = new Institute({
      name,
      isActive,
      isDeleted
    });
    await newInstitute.save();
    res.status(201).json(newInstitute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);  
        if (!institute) {
            return res.status(404).json({ error: 'Institute not found' });
        }
        res.json(institute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});

router.delete("/:id", async (req, res) => {
    try {
        const institute = await Institute.findByIdAndDelete(req.params.id);
        if (!institute) {
            return res.status(404).json({ error: 'Institute not found' });
        }
        res.json({ message: 'Institute deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // runValidators ensures schema validation
    );

    if (!institute) {
      return res.status(404).json({ error: "Institute not found" });
    }

    res.json(institute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
