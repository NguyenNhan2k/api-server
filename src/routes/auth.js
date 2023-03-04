const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.get('/login', authController.indexLogin);
router.get('/register', authController.indexRegister);

router.post('/v1/register', authController.register);
router.post('/v1/login', authController.login);
module.exports = router;
