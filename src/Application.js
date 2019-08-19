const Container = require('./Container');
const Server = require('./Server');

class Application {
  $server = null;
  $container = null;

  constructor () {
    this.$server = new Server();
    this.$container = new Container();

    // Read config
    // Register services
    // Register routes
  }

  register(...params) {
    this.$container.register(...params);
  }

  registerRouter(...params) {
    this.$server.registerRouter(...params);
  }

  listen(...params) {
    this.$server.listen(...params);
  }

  get(name) {
    return this.$container[name];
  }
}

module.exports = Application;
