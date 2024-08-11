// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv=require('dotenv');
const middleware=require("./middleware")
dotenv.config()
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error))

// Define routes
app.get('/home',(req,res)=>{
    res.send("hello world")
})
app.use('/api/users', require('./routes/users'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
