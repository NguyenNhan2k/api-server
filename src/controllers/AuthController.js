const authService = require('../services/AuthService');

class AuthController {
    async indexLogin(req, res, next) {
        try {
            return res.status(200).render('auth/login', {
                layout: 'main',
            });
        } catch (error) {
            return res.status(500);
        }
    }
    async indexRegister(req, res, next) {
        try {
            return res.render('auth/register', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async register(req, res, next) {
        try {
            const valueUser = authService.register(req.body);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AuthController();
