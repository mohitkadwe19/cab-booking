const express = require('express');
const router = express.Router();

const { register } = require('../controller/userController');

router.get('/', function (req, res) {
    res.send('Hello World!')
})


//user registration post controller
router.post('/register', register);



module.exports = router;