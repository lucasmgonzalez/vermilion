const {Model} = require('../../src');
const Phone = require('./Phone');

class User extends Model {
  $hidden = []

  static scopeByEmail (query, email) {
    return query.where('email', email);
  }

  phone() {
    return this.hasMany('Phone', 'user_id', 'id');
  }
}

User.$tableName = 'users';

module.exports = User;
