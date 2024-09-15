const mongoose = require("mongoose");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Verify that the environment variables are loaded correctly
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("secretkey:", process.env.secretkey);

const initData = require("./Course.js");
const Course = require("../models/course.js");

const MONGODB_URI = "mongodb+srv://miraclesdata:LZ2nI9plePb0Msx9@cluster0.siwqank.mongodb.net/?retryWrites=true&w=majority";


if (!MONGODB_URI) {
    console.error("MongoDB connection string is undefined. Please check your .env file.");
    process.exit(1);
}

async function main() {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true, // Required to parse MongoDB connection strings
        useUnifiedTopology: true, // Opt-in to use the MongoDB driver's unified topology layer
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
    });
    console.log("MongoDB connected successfully!");
}

const initdb = async () => {
    try {
        await Course.deleteMany({});
        await Course.insertMany(initData.data);
        console.log("Data was initialized successfully!");
    } catch (error) {
        console.error("Error during database initialization:", error);
    }
};

main()
    .then(initdb)
    .catch((err) => console.error("Error connecting to MongoDB:", err));
