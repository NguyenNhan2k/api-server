const jwt = require('jsonwebtoken');
const { badRequest, unauthorized, internalServer } = require('./handleError');

const signAccessToken = async (payload) => {
    const { id, id_role, email, fullName } = await payload;
    return jwt.sign({ id, id_role, email, fullName }, process.env.KEY_ACCESS_TOKEN, {
        expiresIn: '3d',
    });
};

const signRefreshToken = async (payload) => {
    const { id, id_role } = await payload;
    return jwt.sign({ id, id_role }, process.env.KEY_REFRESH_TOKEN, {
        expiresIn: '7d',
    });
};

const authAccessToken = async (req, res, next) => {
    try {
        const token = await req.cookies.accessToken;
        const newToken = (await token) ? token.split(' ')[1] : undefined;
        if (!newToken) return res.redirect('back');
        jwt.verify(newToken, process.env.KEY_ACCESS_TOKEN, async (err, decode) => {
            // if (err.name === 'TokenExpiredError' && err.message === 'jwt expired') {
            //     console.log('token het han');
            //     const body = { refreshToken: newRefreshToken };
            //     const response = await fetch('http://localhost:8000/auth/v1/refresh-token', {
            //         method: 'post',
            //         body: JSON.stringify(body),
            //         headers: { 'Content-Type': 'application/json' },
            //     });
            //     const data = await response.json();
            //     console.log(data);
            // }

            if (err) {
                return unauthorized(req, res, 'Vui lòng đăng nhập để tiếp tục!');
            }
            req.user = await decode;
            res.locals.user = decode;
            return next();
        });
    } catch (error) {
        return internalServer(req, res);
    }
};
const verifyRefreshToken = (token) => {
    let message;
    const newToken = token ? token.split(' ')[1] : undefined;
    if (newToken) {
        jwt.verify(newToken, process.env.KEY_REFRESH_TOKEN, (err, decode) => {
            if (err) {
                return message;
            }
            return (message = {
                token: newToken,
                user: decode,
            });
        });
    }
    return message;
};
const authStaff = async (req, res, next) => {
    try {
        const user = await req.user;
        if (user.id_role === 'R1' || user.id_role === 'R2') {
            return next();
        }
        return unauthorized(req, res, 'Vui lòng đăng nhập để tiếp tục!');
    } catch (error) {
        return internalServer(req, res);
    }
};
const userName = async (req, res, next) => {
    try {
        res.locals.user = '';
        next();
    } catch (error) {
        console.log(error);
        return internalServer(req, res);
    }
};
module.exports = {
    authAccessToken,
    verifyRefreshToken,
    signAccessToken,
    signRefreshToken,
    authStaff,
    userName,
};
