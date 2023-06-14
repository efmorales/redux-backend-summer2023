var express = require('express');
var router = express.Router();
var usersController = require('./controller/usersController')
var { verifyToken } = require('../../middleware/authorization')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/login-test', function (req, res) {
  console.log(req.body)
  res.send({
    username: req.body.username
  })
})

router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.post('/authtoken', verifyToken, usersController.authtoken);
router.delete('/deleteuser', verifyToken, usersController.deleteuser);


module.exports = router;