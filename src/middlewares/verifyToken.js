const jwt = require('jsonwebtoken');
const request = require('request');
const db = require('../models');
const { badRequest, unauthorized, internalServer } = require('./handleError');

const signAccessToken = async (payload) => {
    const { id, id_role, email, fullName, ...other } = await payload;
    return jwt.sign({ id, id_role, email, fullName }, process.env.KEY_ACCESS_TOKEN, {
        expiresIn: '10s',
    });
};
const signRefreshToken = async (payload) => {
    const { id, id_role } = await payload;
    return jwt.sign({ id, id_role }, process.env.KEY_REFRESH_TOKEN, {
        expiresIn: '7d',
    });
};

const authAccessToken = async (req, res, next) => {
    const token = await req.cookies.accessToken;
    const refreshToken = await req.cookies.refreshToken;

    const newRefreshToken = (await refreshToken) ? refreshToken.split(' ')[1] : undefined;
    const newToken = (await token) ? token.split(' ')[1] : undefined;
    if (!newToken) return res.redirect('back');
    jwt.verify(newToken, process.env.KEY_ACCESS_TOKEN, (err, decode) => {
        if (err) {
            if (err.name === 'TokenExpiredError' && err.message === 'jwt expired') {
                const isRefreshToken = verifyRefreshToken(refreshToken);
                if (!isRefreshToken) {
                    return badRequest(req, res, 'Refresh token invalid!');
                }
                req.infoToken = {
                    user: isRefreshToken,
                    refreshToken: newRefreshToken,
                };
                const newAccessToken = signNewAccessToken(req, res);

                return next();
                if (newAccessToken) {
                    res.cookie('accessToken', 'Bearer ' + newAccessToken, {
                        expires: new Date(Date.now() + 8 * 3600000),
                        httpOnly: true,
                        secure: true,
                    });
                }
            }
            return unauthorized(req, res, 'Vui lòng đăng nhập để tiếp tục!');
        }
        req.user = decode;
        return next();
    });
};
const signNewAccessToken = (req) => {
    const { user, refreshToken } = req.infoToken;
    const findUser = db.Users.findOne({ where: { id: user.id, refresh_token: refreshToken } });
    console.log(findUser);
    if (findUser) {
        const newAccessToken = signAccessToken(findUser.dataValues);
        console.log('hew', newAccessToken);
        return newAccessToken;
    }
    return findUser;
};

const verifyRefreshToken = (token) => {
    let user;
    const newToken = token ? token.split(' ')[1] : undefined;
    if (!token) return false;
    jwt.verify(newToken, process.env.KEY_REFRESH_TOKEN, (err, decode) => {
        if (err) {
            return false;
        }
        user = decode;
    });
    return user;
};
module.exports = {
    authAccessToken,
    verifyRefreshToken,
    signAccessToken,
    signRefreshToken,
};
