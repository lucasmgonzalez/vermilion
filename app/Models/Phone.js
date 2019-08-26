const {Model} = require('../../src');
const User = require('./User');

class Phone extends Model {

  user() {
    return this.belongsTo('User', 'user_id', 'id');
  }

}

Phone.$tableName = 'phones';
Phone.$primaryKey = 'number';

module.exports = Phone;
