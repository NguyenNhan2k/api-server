const jwt = require('jsonwebtoken');

const signAccessToken = async ({ id, role }) => {
    return jwt.sign({ id, role }, process.env.KEY_ACCESS_TOKEN, {
        expiresIn: '1d',
    });
};
const signRefreshToken = async ({ id, role }) => {
    return jwt.sign({ id, role }, process.env.KEY_REFRESH_TOKEN, {
        expiresIn: '7d',
    });
};
module.exports = {
    signAccessToken,
    signRefreshToken,
};
