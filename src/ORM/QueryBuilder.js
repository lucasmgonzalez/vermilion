// const app = require('../Application');
const {ucfirst} = require('../utils');

class QueryBuilder {
  constructor (Model) {
    this.Model = Model;
    this.db = app('database');

    this.query = this.db.table(Model.$tableName);

    return new Proxy(this, {
      get(target, name) {
        if (name === 'then') {
          throw new Error('You need to call get to execute the query');
        }

        if (target[name]) {
          return target[name]
        }

        if (target.query[name] && typeof (target.query[name]) === 'function') {
          return function (...args) {
            target.query[name](...args);
            return this;
          }
        }

        // Check scope
        const scopeName = `scope${ucfirst(name)}`;
        if (target.Model[scopeName] && typeof (target.Model[scopeName]) === 'function' ) {
          return function (...args) {
            target.Model[scopeName](target.query, ...args);
            return this;
          }
        }
      }
    })
  }

  async get () {
    const rows = await this.query;

    const modelInstances = rows.map(row => {
      const instance = new this.Model(row);
      instance.$persisted = true;

      return instance;
    });

    // eager load relations

    // Serialize ???

    return modelInstances;
  }

  async first() {
    const row = await this.query.first();

    if (!row) {
      return null;
    }

    const modelInstance = new this.Model(row);
    modelInstance.$persisted = true;

    return modelInstance;
  }

  async insert(attributes) {
    return this.query.insert(attributes);
  }

  async update(attributes) {
    return this.query.update(attributes);
  }
}

module.exports = QueryBuilder;
