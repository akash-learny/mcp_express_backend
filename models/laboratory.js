import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation",
    },
    status: {
      type: String,
      default: "Active"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

const Laboratory = mongoose.model('laboratory', laboratorySchema);

export default Laboratory;
