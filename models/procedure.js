import mongoose from "mongoose";

const procedureSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    createdOn: { 
        type: Date, 
        default: Date.now 
    },
    department: {
      type:[mongoose.Schema.Types.ObjectId],
      ref: "department",
      required: true,
    },
    lab: {
      type:[mongoose.Schema.Types.ObjectId],
      ref: "laboratory",
      required: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation", 
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute", 
    },
  },
  { timestamps: true }
);

const Procedure = mongoose.model("Procedure", procedureSchema);

export default Procedure;
