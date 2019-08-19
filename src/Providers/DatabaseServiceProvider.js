// Move to Framework
const knex = require('knex');

class DatabaseServiceProvider {
  $config = null;
  $connection = null;

  constructor (config) {
    this.$config = config;

    this.$connection = knex({
      client: config.client,
      connection: {
        filename: this.usesFile() ? config.filename : undefined,
        host: this.usesFile() ? undefined : config.host,
        user: this.usesFile() ? undefined : config.user,
        password: this.usesFile() ? undefined : config.password,
        database: this.usesFile() ? undefined : config.name
      }
    });

    return new Proxy(this, {
      get(target, name) {
        if (name === 'config') {
          return target.$config[name];
        }

        if (target[name]) {
          return target[name];
        }

        return target.$connection[name];
      }
    })
  }

  table = function(tableName) {
    return this.$connection(tableName);
  }

  usesFile = function() {
    return this.$config.client === 'sqlite3' || this.$config.client === 'sqlite';
  }
}

module.exports = DatabaseServiceProvider;
