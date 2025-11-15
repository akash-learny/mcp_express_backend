import mongoose from "mongoose";

const runsSchema = new mongoose.Schema(
  {
    procedure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Procedure",
      required: true,
    },
    createdOn: { 
        type: Date, 
        default: Date.now 
    },
    duedate:{
        type: Date,
        required: true
    },
    objective:{
        type: String,
        required: true
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "laboratory",
      required: true,
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

const Runs = mongoose.model("Runs", runsSchema);

export default Runs;
