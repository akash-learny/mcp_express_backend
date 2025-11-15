import mongoose from "mongoose";

const reportSchema= new mongoose.Schema({
	reportName: {
		type: String,
	},
    analyticsId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "analytics",
      required: true,
    },
	content: {
		type: String,
	},
	createdOn: {
		type: String,
	},
	createdBy: {
		type: String,
	},
});

const reports = mongoose.model("reports",reportSchema);

export default reports;
