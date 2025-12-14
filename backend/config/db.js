import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // In a real environment, use process.env.MONGO_URI
    const conn = await mongoose.connect(import.meta.env.MONGO_URI || 'mongodb://localhost:27017/todofy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If we can't connect (e.g. no DB running), we don't crash the server for this demo code
    console.log('Continuing without database connection (Mock Mode)');
  }
};

export default connectDB;