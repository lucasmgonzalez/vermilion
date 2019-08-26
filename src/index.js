const Application = require('./Application');
// const Container = require('./Container');
// const Server = require('./Server');
const Model = require('./ORM/Model');
const QueryBuilder = require('./ORM/QueryBuilder');

const ErrorHandler = require('./ErrorHandler');

// ServiceProviders
const RouterServiceProvider = require('./Providers/RouterServiceProvider');
const DatabaseServiceProvider = require('./Providers/DatabaseServiceProvider');
const ConfigServiceProvider = require('./Providers/ConfigServiceProvider');

// Dodging strict mode
global.callerName = (line) => {
  const index = line ? line - 1 : 2
  
  const stackTrace = (new Error()).stack; 
  
  let callerName = stackTrace.replace(/^Error\s+/, ''); 
  callerName = callerName.split("\n")[index]; // 1st item is this, 2nd item is caller
  callerName = callerName.replace(/^\s+at Object./, ''); // Sanitize
  callerName = callerName.replace(/ \(.+\)$/, ''); // Sanitize
  callerName = callerName.replace(/\@.+/, ''); // Sanitize

  callerName = callerName.replace(/at ([a-zA-Z]+)\.([a-zA-Z]+)/, '$2').trim();

  return callerName;
}

module.exports = {
  Application,
  ErrorHandler,
  // ORM
  Model,
  QueryBuilder,
  // Providers
  ConfigServiceProvider,
  DatabaseServiceProvider,
  RouterServiceProvider,
}
