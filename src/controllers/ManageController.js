const { internalServer, badRequest } = require('../middlewares/handleError');
const { userSchema } = require('../helpers/validateInput');

class ManageController {
    async index(req, res) {
        try {
            const user = await req.user;
            const mes = await req.flash('message')[0];
            return res.render('manage/dashboard', {
                layout: 'manage',
                message: mes,
                active: 'dashboard',
            });
        } catch (error) {
            return internalServer(req, res);
        }
    }
}
module.exports = new ManageController();
