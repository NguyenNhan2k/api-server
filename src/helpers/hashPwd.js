const bcrypt = require('bcrypt');
const SALT = process.env.SATL_HASHPWD;

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT));
}

module.exports = {
    hashPassword,
};
