const {Application} = require('../src');

const App = new Application();

// Registering global fucntion to reach app
global.app = function app (name) {
  if (!name) {
    return App;
  }

  return App.get(name);
}

// Registering app on container
App.register('app', App);

// Register Services
const providers = require('./Providers');

Object
  .entries(providers)
  .forEach(function ([key, value]) {
    App.register(key, value);
  });

// Load routes
require('./routes');

// Initializing application
App.listen(app('config').app.port, () => {
  console.log('Listening ...');
});
