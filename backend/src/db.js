const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to mongodb!");
    } catch (error) {
        console.log("Error connecting to Mongodb: ", error);
    }
}

module.exports = connectDB;