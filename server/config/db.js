const mongoose = require('mongoose');
const { MONGO_URI } = require('./constants');

let mode = 'memory';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 });
    mode = 'mongo';
    console.log('MongoDB connected');
  } catch (error) {
    mode = 'memory';
    console.warn('MongoDB unavailable. Using in-memory accounts for this session.');
  }
  return mode;
}

function getDbMode() {
  return mode;
}

module.exports = { connectDB, getDbMode };
