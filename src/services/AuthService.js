const { hashPassword, matchPwd } = require('../helpers/hashPwd');
const { internalServer } = require('../middlewares/handleError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../middlewares/verifyToken');
const db = require('../models');
class AuthService {
    async register(req, res) {
        try {
            const { fullName, password, email } = await req.body;
            const [user, created] = await db.Users.findOrCreate({
                where: { email },
                defaults: {
                    fullName,
                    email,
                    password: hashPassword(password),
                },
            });
            const message = await {
                err: created ? 0 : 1,
                type: created ? 'success' : 'warning',
                mes: created ? 'Register successfully! ' : 'Email is already registered!',
                ...(created ? user : {}),
            };
            return message;
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async login(user) {
        try {
            var massage;
            const { email, password } = await user;
            let userModel = await db.Users.findOne({ where: { email, login_type: 'local' } });
            if (!userModel) {
                userModel = await db.Staffs.findOne({ where: { email } });
            }
            if (!userModel) {
                massage = await {
                    err: 1,
                    type: 'warning',
                    mes: 'Your account could not be found !',
                };
                return massage;
            }
            const isPwd = await matchPwd(password, userModel.dataValues.password);
            if (!isPwd) {
                massage = await {
                    err: 1,
                    type: 'warning',
                    mes: 'Incorrect password !',
                };
                return massage;
            }
            const accessToken = await signAccessToken(userModel.dataValues);
            const refreshToken = await signRefreshToken(userModel.dataValues);
            userModel.refresh_token = await refreshToken;
            await userModel.save();
            massage = await {
                err: 0,
                type: 'success',
                mes: 'Logged in successfully!',
                nameUser: userModel.fullName,
                role: userModel.id_role,
                accessToken,
                refreshToken,
            };
            return massage;
        } catch (error) {
            console.log(error);
            return {
                err: 1,
                type: 'warning',
                mes: 'Loggin fail!',
            };
        }
    }
    async loginGoogle(user) {
        var message = {
            err: 1,
            type: 'warning',
            mes: 'Đăng nhập thất bại!',
        };
        try {
            if (!user) {
                return message;
            }
            const accessToken = await signAccessToken(user.dataValues);
            const refreshToken = await signRefreshToken(user.dataValues);
            console.log();
            user.refresh_token = await refreshToken;
            await user.save();
            message = await {
                err: 0,
                type: 'success',
                mes: 'Logged in successfully!',
                role: user.dataValues.id_role,
                nameUser: user.dataValues.fullName,
                accessToken,
                refreshToken,
            };
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async createAccessToken(token) {
        let message = {
            type: 'warning',
            err: 0,
        };
        try {
            // const refreshToken = await verifyRefreshToken(token);
            // if (!refreshToken) message;
            // const { dataValues: user } = await db.Users.findOne({ where: { id: refreshToken.user.id } });
            // if (!refreshToken.token === user.refresh_token) return message;
            // const accessToken = await signAccessToken(user);
            // return accessToken;
        } catch (error) {
            return message;
        }
    }
    async logout(req, res) {
        let message = {
            type: 'warning',
            err: 1,
            mes: 'Logout Fail !',
        };
        try {
            const { id } = await req.user;
            let user = await db.Users.findOne({ where: { id } });
            if (!user) {
                user = await db.Staffs.findOne({ where: { id } });
            }
            if (!user) {
                return message;
            }
            console.log(user);
            user.refresh_token = await null;
            await user.save();
            res.clearCookie('accessToken', { path: '/' });
            res.clearCookie('refreshToken', { path: '/' });
            res.clearCookie('user', { path: '/' });
            return (message = {
                type: 'success',
                err: 0,
                mes: 'Logout in success !',
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
}

module.exports = new AuthService();
