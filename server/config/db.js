import mongoose from 'mongoose';

const connectDB = async () => {
  // Check if we already have a connection
  if (mongoose.connection.readyState >= 1) {
    console.log("=> using existing database connection.");
    return;
  }

  try {
    // Create a new connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("=> new database connection established.");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Re-throw the error to be caught by the startServer function
    throw new Error("Could not connect to MongoDB.");
  }
};

export default connectDB;