import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import userRoutes from './routes/user.js'
import assetsRoutes from './routes/assets.js'
import instituteRoutes from './routes/institute.js'
import procedureRoutes from './routes/procedure.js'
import runsRoutes from './routes/runs.js'
import reportsRoutes from './routes/reports.js';
import analyticsRoutes from './routes/analytics.js';
import roleRoutes from './routes/role.js';
import organisation from './routes/organisation.js';
import department from './routes/department.js';
import laboratory from './routes/laboratory.js';
import script from './routes/script.js';

const app = express();
dotenv.config({ quiet: true })
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/assets', assetsRoutes);
app.use('/institute', instituteRoutes);
app.use('/procedure', procedureRoutes);
app.use('/runs', runsRoutes);
app.use('/reports', reportsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/role', roleRoutes);
app.use('/organisation', organisation);
app.use('/department', department);
app.use('/laboratory', laboratory);
app.use('/script',script);


app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM HOMEPAGE');
})

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));