const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('Missing MongoDB connection string');
  mongoose.set('strictQuery', true);
  return mongoose.connect(uri, {
    autoIndex: true
  });
}

module.exports = connectDB;
