const User = require('../Models/User');

class UserFactory {
  constructor (database) {
    this.database = database;
  }

  getById = function (id) {
    return this.database(User.tableName).where('id', id).first().then(data => new User(data));
  }

  save = function (user) {
    if (user[User.primaryKey]) {
      return this.database(User.tableName).where(User.primaryKey, user[User.primaryKey]).update(user).then(result => !!result);
    } 
    return this.database(User.tableName).insert({
      ...user,
      [User.primaryKey] : Date.now().toString()
    }).then(result => !!result);
  }
}

const factory = function (database) {
  return new UserFactory(database);
};

module.exports = factory;
