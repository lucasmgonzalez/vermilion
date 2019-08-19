class ConfigServiceProvider {
  $config = {}

  constructor (config) {
    // read config directory
    // merge config with _config
    this.$config = config;

    return new Proxy(this, {
      get(target, name) {
        if (name === 'get' || name === 'set') {
          return target[name];
        }

        return target.$config[name];
      }
    })
  }

  get(name) {
    return this.$config[name];
  }

  set(name, value) {
    this.$config[name] = value;
  }

  // Read config directory
}

module.exports = ConfigServiceProvider;
