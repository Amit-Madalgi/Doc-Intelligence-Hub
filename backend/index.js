const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const connectDB = require('./config/db'); // 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB(); // 


app.use('/api/users', authRoutes);

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

// Optional: Serve uploads folder statically (if needed for temporary check/cleanup)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});