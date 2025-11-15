import express from "express";
import Procedure from "../models/procedure.js";
import Department from "../models/department.js";

const router = express.Router();
const formatDate = (date) => date.toLocaleDateString("en-US");

router.get("/", async (req, res) => {
  try {
    const procedures = await Procedure.find();
    res.json(procedures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id);
    if (!procedure) return res.status(404).json({ error: "Procedure not found" });
    res.json(procedure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, department, lab } = req.body;

    if (!name || !department || !lab) {
      return res.status(400).json({
        error: "All fields are required: name, department, lab (all IDs)"
      });
    }

    const departmentData = await Department.findById(department);

    if (!departmentData) {
      return res.status(404).json({ error: "Department not found" });
    }

    const newProcedure = new Procedure({
      name,
      department,
      lab,
      organisation: departmentData.organisationId,
      institute: departmentData.instituteId,
    });

    await newProcedure.save();

    res.status(201).json({
      _id: newProcedure._id,
      name: newProcedure.name,
      department: newProcedure.department,
      lab: newProcedure.lab,
      organisation: newProcedure.organisation,
      institute: newProcedure.institute,
      createdOn: newProcedure.createdOn,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Only procedure name can be updated" });
    }

    // Update only the name field
    const procedure = await Procedure.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!procedure) {
      return res.status(404).json({ error: "Procedure not found" });
    }

    res.json({
      _id: procedure._id,
      procedure_name: procedure.name,
      createdOn: procedure.createdOn.toLocaleDateString("en-US"),
      organisationName: procedure.organisationName,
      department: procedure.department,
      lab: procedure.lab,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE procedure
router.delete("/:id", async (req, res) => {
  try {
    const p = await Procedure.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: "Procedure not found" });

    res.json({ message: "Procedure deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
