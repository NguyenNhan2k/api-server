const { hashPassword } = require('../helpers/hashPwd');
const { internalServer } = require('../middlewares/handleError');
const { registerSchema } = require('../helpers/validateInput');
const db = require('../models');
class AuthService {
    async register(req, res) {
        try {
            const { fullName, password, email, confirmPwd } = await req.body;
            const checkInput = await registerSchema.validate({ fullName, password, email, confirmPwd });
            console.log(checkInput);
            const [user, created] = await db.Users.findOrCreate({
                where: { email },
                default: {
                    fullName,
                    email,
                    password: hashPassword(password),
                },
            });
            const message = await {
                err: created ? 1 : 0,
                mes: created ? 'Register successfully! ' : 'Email is already registered!',
                ...(created ? user : {}),
            };
            return message;
        } catch (error) {
            return internalServer(req, res);
        }
    }
}

module.exports = new AuthService();
