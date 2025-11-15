import express from "express";
import Asset from "../models/assets.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const {
      name,
      assetNumber,
      departmentId, 
      laboratoryId, 
      instituteId,
      organisationId, 
      purchasedDate,
      lastUsedDate,
      status,
    } = req.body;

    if (!name || !organisationId) {
      return res.status(400).json({
        error: "name and organisationId are required.",
      });
    }

    const newAsset = new Asset({
      name,
      assetNumber,
      departmentId,
      laboratoryId,
      instituteId,
      organisationId,
      purchasedDate,
      lastUsedDate,
      status,
    });

    await newAsset.save();

    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET asset by ID
router.get("/:id", async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json(asset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE asset by ID
router.delete("/:id", async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.json({ message: 'Asset deleted successfully' });
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
});

// UPDATE asset by ID
router.put("/:id", async (req, res) => {
    try {
        const updates = req.body;
      const asset = await Asset.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }       
        res.json(asset);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }   
});

export default router;
