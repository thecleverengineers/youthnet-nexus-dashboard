const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;