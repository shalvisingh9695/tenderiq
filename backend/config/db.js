import mongoose from 'mongoose';

/**
 * MongoDB Atlas Connection Configuration
 */
export async function connectDB() {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
  const uri = typeof rawUri === 'string' ? rawUri.trim() : '';

  // Validate that connection string exists and starts with a valid MongoDB protocol
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    console.log('ℹ️  MongoDB Atlas URI (MONGODB_URI) is not configured or in valid format. Operating with built-in persistent storage.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection notice: ${error.message}. Continuing with local fallback store.`);
    return false;
  }
}

// Global connection event hooks (only active if connection is established)
mongoose.connection.on('disconnected', () => {
  if (mongoose.connection.readyState === 0) {
    // Only log if previously connected
    console.log('ℹ️  MongoDB disconnected.');
  }
});

export default connectDB;
