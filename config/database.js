const mongoose = require('mongoose');
const keys = require('./keys');
const logger = require('../utils/logger');

const connectDatabase = () => {
  mongoose.connect(keys.mongoURI);

  const db = mongoose.connection;

  db.on('error', error => {
    logger.error('Database connection error:', error);
  });

  db.once('open', function () {
    logger.info('✅ Database connected successfully');
  });

  return db;
};

module.exports = connectDatabase;
