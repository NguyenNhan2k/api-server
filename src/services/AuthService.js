const db = require('../models');
const bcrypt = require('bcrypt');
const salt = 10;
const hashPwd = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(salt));

class AuthService {
    async register({ fullName, password, email }) {
        try {
            const [user, created] = await db.Users.findOrCreate({
                where: { email },
                default: {
                    fullName,
                    email,
                    password: hashPwd(password),
                },
            });
            const message = await {
                err: created ? 1 : 0,
                mes: created ? 'Register successfully! ' : 'Email is already registered!',
                ...(created ? user : {}),
            };
            console.log(message);
            return message;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new AuthService();
