const User = require('../Models/User');
const {App} = require('../../src');

const UserController = {
  retrieve: async (req, res) => {
    const id = req.params.id;

    throw new Error(`FUUUCK`);

    try {
      const user = await User.find(id);

      res.status(200).json(user.toJSON());
    } catch (err) {
      console.log(err);
    }

  }
}

module.exports = UserController;
