const jwt = require('jsonwebtoken');

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

module.exports = {
    signAccessToken,
    signRefreshToken,
};
