const QueryBuilder = require('./QueryBuilder');
const HasOne = require('./Relationship/HasOne');
const HasMany = require('./Relationship/HasMany');
const BelongsTo = require('./Relationship/BelongsTo');

class Model {
  $guarded = [];
  $hidden = [];
  $attributes = {};
  $relations = {};
  $persisted = false;
  // $booted = false;
  // $frozen = false; -> to freeze objects
  // $originalAttributes = {}; -> For dirty check
  
  constructor(attributes = {}) {
    // Inject attributes into object
    this.fill(attributes);

    return new Proxy(this, {
      get(target, name) {
        // Check instance for properties or methods
        if (target[name]) {
          return target[name];
        }

        // Check relationships
        // [WIP]

        // Check if is attribute
        if (target.$attributes[name]) {
          return target.get(name);
        }

        return undefined;
      },
      set(target, name, value) {
        if (target[name] === undefined) {
          target.set(name, value);
          return true;
        }

        target[name] = value;

        return true;
      }
    });
  }
  
  // Getters and setters

  fill = function (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (!this.$guarded[key]) {
        this.$attributes[key] = value;
      }
    })
  };

  get = function (name) {
    return this.$attributes[name];
  };

  set = function (name, value) {
    this.$attributes[name] = value;
  };

  // Serializers
  
  toObject = function () {
    return Object.entries({...this.$attributes, ...this.$relations}).reduce((acc, [key, value]) => {
      return this.$hidden.indexOf(key) === -1 ? {...acc, [key]: value} : acc;
    }, {});
  };

  toString = function() {
    return JSON.stringify(this.toObject());
  };

  toJSON = function() {
    return this.toObject();
  };

  // Persistance methods

  save = async function() {
    if (this.$persisted) {
      await this._update();

      // clean dirty
    } else {
      await this._insert();

      this.$persisted = true;
    }
    return true;
  };

  delete = async function () {
    await this.query().where(this.$primaryKey, this.$attributes[this.$primaryKey]).delete();

    // freeze

    return true;
  };

  // Relationship
  static with (...relations) {
    return this.query().setRelationsToLoad(relations);
  }

  setRelation = function (name, value) {
    this.$relations[name] = value;
  }

  hasOne = function(model, foreignKey, parentKey) {
    return new HasOne(app(model), foreignKey, parentKey, callerName(), this);
  }

  hasMany = function(model, foreignKey, parentKey) {
    return new HasMany(app(model), foreignKey, parentKey, callerName(), this);
  }

  belongsTo(parentModel, foreignKey, parentKey) {
    return new BelongsTo(app(parentModel), foreignKey, parentKey, callerName(), this);
  }

  // Private Methods

  _insert = async function() {
    // Generate ID
    this.$attributes[this.$primaryKey] = Date.now().toString();

    return this.constructor.query().insert(this.$attributes);
  };

  _update = async function () {
    return this.constructor.query()
      .where(this.$primaryKey, this.$attributes[this.$primaryKey])
      .update(this.$attributes);
  }

  // Static methods
  static async create(attributes) {
    const instance = new this(attributes);
    await instance.save();

    return instance;
  }
  
  static query () {
    return new QueryBuilder(this);
  }

  static find(value) {
    return this.query().find(value);
  }

  static findBy(key, value) {
    return this.query().findBy(key, value);
  }

  static all() {
    return this.query().get();
  }
};

Model.$primaryKey = 'id';
Model.$createdAtName = 'created_at';
Model.$updatedAtName = 'update_at';

// Model.find = function (primaryKey) {
//   return database(this.tableName).where(this.primaryKey, primaryKey).first().then(res => {
//     if (!res) {
//       throw {error: '404', message: 'Model not found'}
//     }

//     return new this(res);
//   });
// }

// Model.build = function (data) {
//   if (Array.isArray(data)) {
//     return data.map(item => new this(item));
//   }

//   return new this(data);
// }

// // Inject Query builder methods
// Object.entries(database).forEach(([key, value]) => {
//   if (key === 'toString') {
//     return;
//   }

//   Model[key] = function (...params) {
//     return database(this.tableName)[key](...params);
//   };
// });

// Failed attempt to instantiate class before knex delivers result
  
// Object.entries(database).forEach(([key, value]) => {
//   Model[key] = function (...params) {
//     // First
//     if (key === 'first') {
//       return database(this.tableName).first().then(res => {
//         // instantiate here
//         return res;
//       });
//     }

//     const handler = {
//       get(target, prop){
//         console.log('GET', prop);
//         if (prop === 'get'){
//           console.log('trapped');
//           return new Promise((res, rej) => {
//             console.log('BUUUUH');
//             res();
//           });
//         }
//         console.log('feck');
//         return target[prop];
//       },
//       apply(target, prop, argumentList) {
//         console.log('APPLY');
//         console.log('prop', prop);
//         console.log('argumentList', argumentList);

//         if (prop === 'get') {
//           return target.then(res => {
//             // instantiate here
//             return res;
//           });
//         }

//         if (prop === 'first') {
//           console.log('FIIIIIRST');
//           return target.first().then(res => {
//             // instantiate here
//             return res;
//           })
//         }
        
//         return new Proxy(target[props](argumentList), handler);
//       }
//     }

//     const query = database(this.tableName)[key](...params).finally((...res) => {
//       console.log('finally', res)
//     });
//     const proxy = new Proxy(query, handler);
//     // console.log(proxy);

//     return proxy;
//   }
// });

// Get all
// Model.get = function () {
//   return database(this.tableName).then(res => {
//     // instantiate here
//     return res;
//   });
// }

module.exports = Model;
