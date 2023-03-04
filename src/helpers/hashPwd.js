const bcrypt = require('bcrypt');
const SALT = process.env.SATL_HASHPWD;

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT));
}
const matchPwd = async (password, hashPwd) => {
    const isMatch = await bcrypt.compareSync(password, hashPwd);
    return isMatch;
};
module.exports = {
    hashPassword,
    matchPwd,
};
