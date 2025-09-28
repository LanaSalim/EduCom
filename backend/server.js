const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);


// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/fee-structures', require('./routes/FeeRoutes'));
app.use('/api/batch-fees', require('./routes/batchFeeRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});