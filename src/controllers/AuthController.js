const AuthService = require('../services/AuthService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { registerSchema, loginSchema } = require('../helpers/validateInput');

class AuthController {
    async indexLogin(req, res) {
        try {
            const mes = await req.flash('message')[0];
            return res.status(200).render('auth/login', {
                layout: 'main',
                message: mes,
            });
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async indexRegister(req, res) {
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
    async indexAuthGg(req, res) {
        try {
            const user = await req.user;
            const response = await AuthService.loginGoogle(user, res);
            const message = {
                type: response.type,
                mes: response.mes,
            };
            res.cookie('accessToken', 'Bearer ' + response.accessToken, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: true,
            });
            res.cookie('user', response.nameUser, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.cookie('refreshToken', 'Bearer ' + response.refreshToken, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: true,
            });

            req.flash('message', message);
            return res.redirect('/home');
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async register(req, res) {
        try {
            const { error } = await registerSchema.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
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
                return badRequest(req, res, messageError);
            }
            const response = await AuthService.login({ ...value }, res);
            const message = {
                type: response.type,
                mes: response.mes,
            };
            if (response.err === 0) {
                res.cookie('accessToken', 'Bearer ' + response.accessToken, {
                    expires: new Date(Date.now() + 8 * 3600000),
                    httpOnly: true,
                    secure: true,
                });
                res.cookie('user', response.nameUser, {
                    expires: new Date(Date.now() + 8 * 3600000),
                });
                res.cookie('refreshToken', 'Bearer ' + response.refreshToken, {
                    expires: new Date(Date.now() + 8 * 3600000),
                    httpOnly: true,
                    secure: true,
                });
                req.flash('message', message);

                if (response.role == 'R3' && response.err == 0) {
                    return res.redirect('/');
                }
                if (response.role == 'R2' || (response.role == 'R1' && response.err == 0)) {
                    return res.redirect('/manage');
                }
            }
            req.flash('message', message);
            return res.redirect('/home');
        } catch (error) {
            return internalServer(req, res);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = await req.body.refreshToken;
            const response = await AuthService.createAccessToken(refreshToken);
            return res.json('test');
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AuthController();
