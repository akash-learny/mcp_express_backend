import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    type:{
       type:String,
    },
    procedure_management: {
      type: Object,
      default: {},
    },
    analytics_management: {
      type: Object,
      default: {},
    },
    reports_management: {
      type: Object,
      default: {},
    },
    profile_management: {
      type: Object,
      default: {},
    },
    asset_management: {
      type: Object,
      default: {},
    },
    runs_management: {
      type: Object,
      default: {},
    },
    user_management: {
      type: Object,
      default: {},
    },
    role_management: {
      type: Object,
      default: {},
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

const Role = mongoose.model('Role', roleSchema);

export default Role;
