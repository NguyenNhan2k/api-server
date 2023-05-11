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
            const { type, column, page, id_category, district } = await req.query;
            let queries = await {};
            const order = (await type) && column ? [column, type] : [];
            if (id_category) {
                queries.id_category = await id_category;
            }
            if (district) {
                queries.district = await district;
            }
            const response = await branchService.getAll({ page, order }, queries);
            const message = await req.flash('message')[0];
            return res.render('home/detailStore', {
                layout: 'main',
                branchs: response.branchs,
                countPage: response.countPage,
                categories: response.categories,
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

            const idRate = await req.query.idRate;
            // id comment khi user chỉnh sửa bình luận
            const idUpdate = await req.query.idUpdate;
            var actionForm;
            var isUser;
            if (req.user) {
                isUser = req.user.id;
            }
            if (idUpdate) {
                if (!isUser) {
                    return badRequest(req, res, 'Vui lòng đăng nhập tài khoản!');
                }
                actionForm = `/rates/update/${idUpdate}?_method=PATCH`;
            }
            const { type, column, page, table } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await branchService.getOneBySlug(slug, { page, order, table }, idRate, idUpdate);
            const message = await req.flash('message')[0];
            return res.render('home/detailBranch', {
                layout: 'main',
                price: response.price,
                dishs: response.dishs,
                branch: response.branch,
                comment: response.comment,
                categories: response.categories,
                commments: response.commments,
                countPageDish: response.countPageDish,
                displayModalCommet: response.displayModalCommet,
                actionForm,
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
