const AuthService = require('../services/AuthService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { registerSchema, loginSchema } = require('../helpers/validateInput');

class AuthController {
    async indexLogin(req, res, next) {
        try {
            const mes = await req.flash('message')[0];
            console.log(mes);
            return res.status(200).render('auth/login', {
                layout: 'main',
                message: mes,
            });
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async indexRegister(req, res, next) {
        try {
            const mes = await req.flash('message')[0];
            return res.render('auth/register', {
                layout: 'main',
                message: mes,
            });
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async register(req, res, next) {
        try {
            const { error, value } = await registerSchema.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(messageError, res);
            }
            const response = await AuthService.register(req, res);
            if (response.err == 1) {
                req.flash('message', response);
                return res.redirect('back');
            }
            req.flash('message', response);
            return res.redirect('/auth/login');
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async login(req, res) {
        try {
            const { error, value } = await loginSchema.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(messageError, res);
            }
            const response = await AuthService.login({ ...value }, res);
            const message = {
                type: response.type,
                mes: response.mes,
            };
            res.cookie('access_token', 'Bearer ' + response.accessToken, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: true,
            });
            res.cookie('refreshToken', 'Bearer ' + response.refreshToken, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: true,
            });
            if (response.role == 'R3' && response.err == 0) {
                req.flash('message', message);
                res.redirect('/auth/register');
            } else if (response.err == 1) {
                req.flash('message', message);
                res.redirect('back');
            }
            req.flash('message', message);
            res.redirect('/home');
        } catch (error) {
            return internalServer(req, res);
        }
    }
}
module.exports = new AuthController();
