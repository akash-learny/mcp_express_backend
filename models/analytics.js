import mongoose from 'mongoose';


const chartAnnotationSchema = new mongoose.Schema({
  x: { type: String },
  y: { type: Number },
  type: { type: String },
  text: { type: String },
  rowIndex: { type: Number },
});

const analyticsChannelsSchema =new mongoose.Schema({
  isVisible: { type: Boolean },
  sensor: { type: String },
  axis: { type: String },
  color: { type: String },
  annotations: [chartAnnotationSchema],
});


const analyticsChartsSchema = new mongoose.Schema({
  runNumber: { type: String },
  analyticsAssets: [{ type: String }],
  analyticsChannels: [analyticsChannelsSchema],
  windowPeriod: { type: String },
  aggregateFunction: { type: String },
});


const analyticsSchema =new mongoose.Schema(
  {
    name: { type: String },
    runsId: [{      
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Runs",
          required: true,
        }],
    runsNumber: [{ type: String }],
    createdOn: { type: String },
    createdByName:{  type: String },
    results: { type: [Object], default: [] },
    imageUrls: [{ type: String }],
    analyticsChartsList: [analyticsChartsSchema],
  },
  {
    timestamps: true,
  }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
