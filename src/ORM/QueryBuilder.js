// const app = require('../Application');
const {ucfirst} = require('../utils');

class QueryBuilder {
  $relationsToLoad = [];

  constructor (Model) {
    this.Model = Model;
    this.db = app('database');

    this.query = this.db.table(Model.$tableName);

    return new Proxy(this, {
      get(target, name) {
        if (name === 'then') {
          throw new Error('You need to call get to execute the query');
        }

        if (name === 'setRelationsToLoad') {
          return function (...args) {
            target[name](...args);
            return this;
          }
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

    const modelInstances = Promise.all(rows.map(async (row) => {
      const instance = new this.Model(row);
      instance.$persisted = true;

      // if (this.$relationsToLoad.length > 0) {
      //   await Promise.all(this.$relationsToLoad.map(relation => instance[relation]().get() ));
      // }

      return instance;
    }));

    // eager load relations
    if (this.$relationsToLoad.length > 0) {
      // eagerLoadRelations(modelInstances);
      await Promise.all(this.$relationsToLoad.map(relation => instance[relation]().get() ));
    }

    // Serialize ???

    return modelInstances;
  }
   
  // TODO Should this be here?
  async eagerLoadRelations(instances) {
    if (instances.length === 0) {
      return;
    }

    const exampleInstance = instances[0];
    
    const promises = this.$relationsToLoad.map(async (relationName) => {
      const relation = exampleInstance[relationName]();

      let values = [];

      if (['HasMany', 'HasOne'].includes(relation.constructor.name)) {
        const values = instances.map(item => item[relation.$parentKey]);
        const relatedModel = relation.$relatedModel;

        const rows = await relatedModel.query().whereIn(relation.$foreignKey, values).get();

        // set relation
      }

      if (['BelongsTo'].includes(relation.constructor.name)) {
        const values = instances.map(item => item[relation.$foreignKey]);
        const relatedModel = relation.$relatedModel;

        const rows = await relatedModel.query().whereIn(relation.$parentKey, values).get();

        // set relation
      }

      const values = Array.isArray(instances) ? instances.map(item => item[this.])
    }) 
  }

  setRelationsToLoad (relations) {
    this.$relationsToLoad = relations;
  }

  async first() {
    try{
      const row = await this.query.first();

      if (!row) {
        return null;
      }

      const modelInstance = new this.Model(row);
      modelInstance.$persisted = true;

      if (this.$relationsToLoad.length > 0) {
        await Promise.all(this.$relationsToLoad.map(relation => modelInstance[relation]().get() ));
      }
      
      return modelInstance;
    } catch (err) {
      console.log(err);
    }
  }

  async insert(attributes) {
    return this.query.insert(attributes);
  }

  async update(attributes) {
    return this.query.update(attributes);
  }

  async find(value) {
    return await this.findBy(this.Model.$primaryKey, value);
  }

  async findBy(key, value) {
    const data = await this.where(key, value).first();

    if (!data) {
      throw {error: '404', message: 'Model not found'}
    }

    return data;
  }
}

module.exports = QueryBuilder;
