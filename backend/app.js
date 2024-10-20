const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const ruleRoutes = require('./routes/ruleRoutes');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors()); // Use CORS middleware
app.use(express.json());

// Rule routes
app.use('/api/rules', ruleRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
