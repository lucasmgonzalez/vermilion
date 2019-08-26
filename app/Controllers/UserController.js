// const User = require('../Models/User');
const Phone = require('../Models/Phone');
const {App} = require('../../src');

const UserController = {
  retrieve: async (req, res) => {
    const number = req.params.id;

    try {
      const phones = await Phone.with('user').get();

      res.status(200).json({phones: phones.map(item => item.toJSON())});
    } catch (err) {
      console.log(err);
    }

  }
}

module.exports = UserController;
