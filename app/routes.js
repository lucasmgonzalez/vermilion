const {ErrorHandler} = require('../src');
const UserController = require('./Controllers/UserController');

const router = app('router');

// Register application middlewares
// router.use()

router.get('/', (req, res) => {
  res.send('Good morning america');
});

router.get('/user/:id', UserController.retrieve);

router.use(ErrorHandler);
