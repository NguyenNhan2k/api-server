const AuthService = require('../services/AuthService');
const { internalServer } = require('../middlewares/handleError');
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
            const valueUser = await AuthService.register(req, res);
            console.log(valueUser);
            return res.status(200).render('home', {
                layout: 'main',
            });
        } catch (error) {
            return internalServer(req, res);
        }
    }
}
module.exports = new AuthController();
