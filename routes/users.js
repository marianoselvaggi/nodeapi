var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var { check, validationResult } = require('express-validator/check');
const validateToken = require('../middlewares/authotize').validateToken;

/* GET users listing. */
router.get('/', validateToken, userController.findAll);

router.post('/', [check('name').exists(), check('password').exists()], userController.add)

router.post('/login', [check('name').exists(), check('password').exists()], userController.login);

module.exports = router;
