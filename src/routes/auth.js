const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
router.get('/login', authController.indexLogin);
router.get('/register', authController.indexRegister);

router.post('/register', authController.register);
module.exports = router;
