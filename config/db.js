// bring in mongoose
const mongoose = require("mongoose");

// connect to db asynchronously
const connectDB = async () => {
    // try catch since db connection could fail
    try {
        // await the connection
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("DB connection error: ", error);

        // exit with error code
        process.exit(1);
    }
};

module.exports = connectDB;
