
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI, fallback to hardcoded for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT_MS) || 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      retryWrites: process.env.DB_RETRY_WRITES === 'true' || true,
      w: process.env.DB_W || 'majority',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Log connection status for production monitoring
    if (process.env.NODE_ENV === 'production') {
      console.log('MongoDB connection established successfully in production mode');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // In production, we want to retry connection
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  
  // Auto-reconnect in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Attempting to reconnect to MongoDB...');
    setTimeout(connectDB, 5000);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB shutdown:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
