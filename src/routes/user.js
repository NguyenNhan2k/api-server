const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { authAccessToken } = require('../middlewares/verifyToken');

router.get('/profile', authAccessToken, userController.index);
router.get('/logout', userController.logOut);

module.exports = router;
