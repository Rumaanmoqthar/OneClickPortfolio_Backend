import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This line reads the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit the process with a failure code if the database connection fails on startup
    process.exit(1);
  }
};

export default connectDB;

