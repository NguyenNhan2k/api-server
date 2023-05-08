const { internalServer, badRequest } = require('../middlewares/handleError');
const { removeAvatarForController } = require('../helpers/manage');
const branchService = require('../services/BranchService');
class HomeController {
    async index(req, res, next) {
        const message = await req.flash('message')[0];
        console.log(message);
        res.render('home/home', {
            layout: 'main',
            message,
        });
    }
    async indexListBranch(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await branchService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('home/detailStore', {
                layout: 'main',
                branchs: response.branchs,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexDetailBranch(req, res) {
        try {
            const slug = await req.params.slug;
            var isUser;
            if (req.user) {
                isUser = req.user.id;
            }
            const response = await branchService.getOneBySlug(slug);
            const message = await req.flash('message')[0];
            return res.render('home/detailBranch', {
                layout: 'main',
                branch: response.branch,
                categories: response.categories,
                price: response.price,
                dishs: response.branch.dishs,
                message,
                isUser,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new HomeController();
