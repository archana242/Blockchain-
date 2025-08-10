const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const candidateRoutes = require('./routes/candidateRoutes');
const voterRoutes = require('./routes/voterRoutes');

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api/voter', voterRoutes);

// Routes
app.use('/api/candidate', candidateRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch(err => {
  console.error('DB connection error:', err);
});
