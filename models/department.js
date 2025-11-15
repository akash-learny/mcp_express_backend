import mongoose from "mongoose";


const departmentSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    departmentNumber:{
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation",
      required: true,
    },
    status: {
      type: String,
      default: "Active"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const department= mongoose.model("department", departmentSchema);

export default department;