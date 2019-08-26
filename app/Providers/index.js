const {
  ConfigServiceProvider,
  DatabaseServiceProvider,
  RouterServiceProvider
} = require('../../src'); 

const User = require('../Models/User');
const Phone = require('../Models/Phone');

const config = require('../../config');

// Register your services
module.exports = {
  config: new ConfigServiceProvider(config),
  database: container => new DatabaseServiceProvider(container.config.database),
  router: container => new RouterServiceProvider(container.app),

  // Models
  'User': () => User,
  'Phone': () => Phone
}
