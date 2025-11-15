import express from "express";
import Runs from "../models/runs.js";
import Procedure from "../models/procedure.js";
import User from "../models/user.js";

const router = express.Router();
const formatDate = (date) => date?.toLocaleDateString("en-US");

router.get("/", async (req, res) => {
  try {
    const runs = await Runs.find();
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const run = await Runs.findById(req.params.id);
    if (!run) return res.status(404).json({ error: "Run not found" });
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { procedure, duedate, objective, organisation, department, lab, assignTo } = req.body;

    if (!procedure || !duedate || !objective || !organisation || !department || !lab || assignTo) {
      return res.status(400).json({ error: "All fields are required: procedure, duedate, objective, organisation, department, lab, assignTo" });
    }
    if (new Date(duedate) <= new Date()) {
      return res.status(400).json({ error: "Due date must be a future date" });
    }
    const newRun = new Runs({
      procedure,
      duedate,
      objective,
      organisation,
      department,
      lab,
      assignTo,
    });
    await newRun.save();
    res.status(201).json(newRun);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { duedate, objective, assignTo } = req.body;
    const run = await Runs.findById(req.params.id);
    if (!run) return res.status(404).json({ error: "Run not found" });

    // Validate due date
    if (duedate && new Date(duedate) <= new Date()) {
      return res.status(400).json({ error: "Due date must be a future date" });
    }

    if (duedate) run.duedate = duedate;
    if (objective) run.objective = objective;

    if (assignTo) {
      const userDoc = await User.findById(assignTo);
      if (!userDoc)
        return res.status(404).json({ error: "Assigned user not found" });
      run.assignTo = assignTo;
    }

    await run.save();

    const updatedRun = await Runs.findById(run._id)
      .populate("assignTo", "firstName")
    res.json({
      _id: updatedRun._id,
      procedure_name: updatedRun.procedure_name,
      createdOn: formatDate(updatedRun.createdOn),
      dueDate: formatDate(updatedRun.duedate),
      objective: updatedRun.objective,
      organisationName: updatedRun.organisationName,
      department: updatedRun.department,
      lab: updatedRun.lab,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const run = await Runs.findByIdAndDelete(req.params.id);
    if (!run) return res.status(404).json({ error: "Run not found" });

    res.json({ message: "Run deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
