const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

const passport = require('passport');

router.get('/login', authController.indexLogin);
router.get('/register', authController.indexRegister);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', async (err, user) => {
            if (user) req.user = user;
            next();
        })(req, res, next);
    },
    authController.indexAuthGg,
);
router.get('/v1/logout', authController.logout);
router.post('/v1/register', authController.register);
router.post('/v1/login', authController.login);
router.post('/v1/refresh-token', authController.refreshToken);

module.exports = router;
