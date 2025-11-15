import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation",
      required: true,
    },
    department: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "department",
      required: true,
    },
    lab: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "laboratory",
      required: true,
    },
    status: {
      type: String,
      default: "Active"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
