class AuthController {
    async indexLogin(req, res, next) {
        try {
            return res.render('auth/login', {
                layout: 'main',
            });
        } catch (error) {}
    }
    async indexRegister(req, res, next) {
        try {
            return res.render('auth/register', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AuthController();
