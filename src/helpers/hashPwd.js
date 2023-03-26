const bcrypt = require('bcrypt');

function hashPassword(password) {
    const SALT = 10;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT));
    return hash;
}
const matchPwd = async (password, hashPwd) => {
    const isMatch = await bcrypt.compareSync(password, hashPwd);
    return isMatch;
};
module.exports = {
    hashPassword,
    matchPwd,
};
