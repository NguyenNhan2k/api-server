const { hashPassword, matchPwd } = require('../helpers/hashPwd');
const { internalServer } = require('../middlewares/handleError');
const { signAccessToken, signRefreshToken } = require('../middlewares/verifyToken');
const db = require('../models');
class AuthService {
    async register(req, res) {
        try {
            const { fullName, password, email, confirmPwd } = await req.body;
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
            const userModel = await db.Users.findOne({ where: { email } });
            if (!userModel) {
                massage = await {
                    err: 1,
                    type: 'warning',
                    mes: 'Your account could not be found !',
                };
                return massage;
            }
            const { dataValues } = await userModel;
            const isPwd = await matchPwd(password, dataValues.password);
            if (!isPwd) {
                massage = await {
                    err: 1,
                    type: 'warning',
                    mes: 'Incorrect password !',
                };
                return massage;
            }
            const accessToken = await signAccessToken(dataValues);
            const refreshToken = await signRefreshToken(dataValues);
            userModel.refresh_token = await refreshToken;
            await userModel.save();
            massage = await {
                err: 0,
                type: 'success',
                mes: 'Logged in successfully!',
                role: userModel.id_role,
                accessToken,
                refreshToken,
            };
            return massage;
        } catch (error) {
            return {
                err: 1,
                type: 'warning',
                mes: error,
            };
        }
    }
    async loginGoogle(user) {
        try {
            var message;
            const accessToken = await signAccessToken(user.dataValues.id, user.dataValues.id_role);
            const refreshToken = await signRefreshToken(user.dataValues.id, user.dataValues.id_role);
            user.refresh_token = await refreshToken;
            await user.save();
            message = await {
                err: 0,
                type: 'success',
                mes: 'Logged in successfully!',
                role: user.dataValues.id_role,
                accessToken,
                refreshToken,
            };
            return message;
        } catch (error) {
            return {
                err: 1,
                type: 'warning',
                mes: error,
            };
        }
    }
    async getAccessToken(token) {
        var message;
        try {
            const getRefreshToken = await token.split(' ')[1];
            console.log(getRefreshToken);
        } catch (error) {
            message = {
                err: 1,
                type: 'warning',
                mes: error,
            };
            return message;
        }
    }
}

module.exports = new AuthService();
