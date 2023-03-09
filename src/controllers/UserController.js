const userService = require('../services/UserService');

const { internalServer, badRequest } = require('../middlewares/handleError');
class UserController {
    async index(req, res) {
        try {
            return res.render('customer/profile');
        } catch (error) {
            internalServer(req, res);
        }
    }
    async logOut(req, res) {
        try {
            const message = await {
                err: 1,
                mes: 'Đăng xuất thành công!',
                type: 'success',
            };
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            req.flash('message', message);
            return res.redirect('auth/login');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new UserController();
