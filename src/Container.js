const path = require('path');

class Container {
  $registers = {}
  $cached = {};

  constructor () {
    const container = new Proxy(this, {
      get(target, prop) {
        if (target[prop]) {
          return target[prop];
        }

        // Prop not cached/instantiated
        if(!target.$cached[prop]) {
          const value = target.$registers[prop];
          
          // Can be a value or a factory
          target.$cached[prop] = typeof value === 'function' ? value(container) : value;
        }
        
        return target.$cached[prop];
      }
    });

    return container;
  };

  register = function (name, value) {
    if (this.$registers[name]) {
      throw new Error(`Name ${name} already registered`);
    }

    this.$registers[name] = value;
  }
}

// const container = new Container();

// container.register('config', {
//   database: {
//     client: 'sqlite3',
//     filename: path.resolve(__dirname, '../config/mydb.sqlite'),
//     host: '127.0.0.1',
//     name: 'secret',
//     user: 'root',
//     password: 'secret'
//   }
// });

// container.register('database', container => {
//   return knex({
//     client: container.config.database.client,
//     connection: {
//       filename: container.config.database.filename,
//       // host: _container.config.database.host,
//       // user: _container.config.database.user,
//       // password: _container.config.database.password,
//       // database: _container.config.database.name
//     }
//   });
// });

module.exports = Container;
