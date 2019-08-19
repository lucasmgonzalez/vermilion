const path = require('path');

// Creating helper functions
const rootPath = (relativePath) => path.resolve(__dirname, '../', relativePath);

const env = (name, defaultValue) => {
  const value = process.env[name] || defaultValue;

  if (typeof value === 'string') {
    if (['true', 'false'].includes(value)) {
      return value === 'true';
    }
  }

  return value;
};

// Registering helpers globally
global.env = env;
global.rootPath = rootPath;

// Loading config from .env file
require('dotenv').config();

// Exporting config
module.exports = {
  app: require('./app'),
  
  database: require('./database')
}
