import mongoose from "mongoose";

const scriptSchema=new mongoose.Schema({
	script: {
		type: String,
	},
	type: {
		type: String,
	},
	createdby: {
		type: String,
	},
	name: {
		type: String,
	},
});

const script = mongoose.model("scripts",scriptSchema);

export default script;