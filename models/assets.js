import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    assetNumber: {
      type: String,
    },
    departmentId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "department",
    },
    laboratoryId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "laboratory",
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organisation",
      required: true,
    },
    purchasedDate: {
      type: String,
    },
    lastUsedDate: {
      type: String,
    },
    status: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    availability: {
      type: String,
    },
    expiryDate: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
