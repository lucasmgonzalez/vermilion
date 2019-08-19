const {Model} = require('../../src');

class User extends Model {
  $hidden = []

  static scopeByEmail (query, email) {
    return query.where('email', email);
  }
}

User.$tableName = 'users';

module.exports = User;
